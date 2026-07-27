/**
 * Phase 5D.0 — authenticated Row Level Security and role enforcement.
 *
 * Complements `validate-backend.mjs` (which covers the anonymous role) by
 * exercising the database as a *signed-in user* at each privilege tier:
 *
 *   editor       create + edit content, no deletes
 *   admin        + delete content and manage media
 *   super_admin  + manage people and roles
 *
 * The session is obtained from an admin-generated magic link, so no password is
 * handled here. The single test user is temporarily role-flipped to exercise
 * each tier, then restored to `super_admin`.
 *
 * Run:
 *   node --env-file=.env.local scripts/validate-auth-roles.mjs <email>
 */

import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = process.argv[2];

if (!url || !anonKey || !serviceKey || !email) {
  console.error("Usage: node --env-file=.env.local scripts/validate-auth-roles.mjs <email>");
  process.exit(1);
}

const admin = createClient(url, serviceKey, { auth: { persistSession: false } });

const PREFIX = "zz-authtest-";
let passed = 0;
let failed = 0;
const failures = [];

function check(name, ok, detail = "") {
  if (ok) {
    passed++;
    console.log(`  PASS  ${name}`);
  } else {
    failed++;
    failures.push(`${name}${detail ? ` — ${detail}` : ""}`);
    console.log(`  FAIL  ${name}${detail ? ` — ${detail}` : ""}`);
  }
}

const section = (t) => console.log(`\n${t}`);

/** Sign in without a password, via a one-time admin-issued link. */
async function signIn() {
  const { data, error } = await admin.auth.admin.generateLink({ type: "magiclink", email });
  if (error) throw new Error(`generateLink failed: ${error.message}`);
  const tokenHash = data?.properties?.hashed_token;
  if (!tokenHash) throw new Error("no hashed_token returned");

  const verifier = createClient(url, anonKey, { auth: { persistSession: false } });
  const { data: verified, error: verr } = await verifier.auth.verifyOtp({
    token_hash: tokenHash,
    type: "magiclink",
  });
  if (verr) throw new Error(`verifyOtp failed: ${verr.message}`);

  const accessToken = verified?.session?.access_token;
  if (!accessToken) throw new Error("no access token in session");

  return {
    accessToken,
    refreshToken: verified.session.refresh_token,
    userId: verified.user.id,
    client: createClient(url, anonKey, {
      global: { headers: { Authorization: `Bearer ${accessToken}` } },
      auth: { persistSession: false, autoRefreshToken: false },
    }),
  };
}

async function setRole(role) {
  const { error } = await admin.from("profiles").update({ role }).eq("email", email);
  if (error) throw new Error(`could not set role ${role}: ${error.message}`);
}

const created = { programs: [], media: [], galleryItems: [] };

async function main() {
  section("Session establishment");
  const session = await signIn();
  check("magic-link session established", !!session.accessToken);
  check("session resolves to the expected user", !!session.userId);

  const { data: whoami } = await session.client
    .from("profiles")
    .select("email, role")
    .eq("id", session.userId)
    .single();
  check("authenticated user CAN read own profile", whoami?.email === email, JSON.stringify(whoami));
  check("role resolves as super_admin", whoami?.role === "super_admin", whoami?.role);

  // -- session refresh -------------------------------------------------------
  section("Session refresh");
  const refresher = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: refreshed, error: refreshErr } = await refresher.auth.refreshSession({
    refresh_token: session.refreshToken,
  });
  check(
    "refresh token exchanges for a new access token",
    !refreshErr && !!refreshed?.session?.access_token,
    refreshErr?.message,
  );
  check(
    "refreshed token differs from the original",
    refreshed?.session?.access_token !== session.accessToken,
  );

  // -- super_admin tier ------------------------------------------------------
  section("RLS — super_admin");
  const draftSlug = `${PREFIX}draft`;
  const { data: draft, error: insErr } = await session.client
    .from("programs")
    .insert({
      slug: draftSlug,
      title: draftSlug,
      category: "art",
      summary: "auth test",
      status: "draft",
    })
    .select("id, updated_by")
    .single();
  check("super_admin CAN insert a program", !insErr && !!draft?.id, insErr?.message);
  if (draft?.id) created.programs.push(draft.id);

  const { data: draftsVisible } = await session.client
    .from("programs")
    .select("slug")
    .eq("slug", draftSlug);
  check("super_admin CAN read draft content", (draftsVisible?.length ?? 0) === 1);

  const { error: updErr } = await session.client
    .from("programs")
    .update({ title: "updated by super_admin" })
    .eq("slug", draftSlug);
  check("super_admin CAN update a program", !updErr, updErr?.message);

  const { data: allProfiles } = await session.client.from("profiles").select("id");
  check("super_admin CAN read all profiles", (allProfiles?.length ?? 0) >= 1);

  // -- editor tier -----------------------------------------------------------
  section("RLS — editor (delete must be refused)");
  await setRole("editor");

  const editorSlug = `${PREFIX}editor`;
  const { data: editorRow, error: editorInsErr } = await session.client
    .from("programs")
    .insert({ slug: editorSlug, title: editorSlug, category: "education", summary: "auth test" })
    .select("id")
    .single();
  check("editor CAN insert a program", !editorInsErr && !!editorRow?.id, editorInsErr?.message);
  if (editorRow?.id) created.programs.push(editorRow.id);

  const { error: editorUpdErr } = await session.client
    .from("programs")
    .update({ title: "edited by editor" })
    .eq("slug", editorSlug);
  check("editor CAN update a program", !editorUpdErr, editorUpdErr?.message);

  await session.client.from("programs").delete().eq("slug", editorSlug);
  const { data: stillThere } = await admin
    .from("programs")
    .select("id")
    .eq("slug", editorSlug)
    .maybeSingle();
  check("editor CANNOT delete a program (row survives)", !!stillThere?.id);

  // Privilege-escalation guard: an editor must not be able to promote itself.
  const { error: escalateErr } = await session.client
    .from("profiles")
    .update({ role: "super_admin" })
    .eq("id", session.userId);
  const { data: roleNow } = await admin
    .from("profiles")
    .select("role")
    .eq("id", session.userId)
    .single();
  check(
    "editor CANNOT escalate own role to super_admin",
    roleNow?.role === "editor",
    `guard error: ${escalateErr?.message ?? "none"}; role is now ${roleNow?.role}`,
  );

  const { error: deactivateErr } = await session.client
    .from("profiles")
    .update({ is_active: false })
    .eq("id", session.userId);
  const { data: activeNow } = await admin
    .from("profiles")
    .select("is_active")
    .eq("id", session.userId)
    .single();
  check(
    "editor CANNOT deactivate own account",
    activeNow?.is_active === true,
    `guard error: ${deactivateErr?.message ?? "none"}`,
  );

  // -- admin tier ------------------------------------------------------------
  section("RLS — admin (delete permitted)");
  await setRole("admin");

  await session.client.from("programs").delete().eq("slug", editorSlug);
  const { data: goneNow } = await admin
    .from("programs")
    .select("id")
    .eq("slug", editorSlug)
    .maybeSingle();
  check("admin CAN delete a program", !goneNow?.id);
  if (!goneNow?.id) created.programs = created.programs.filter((id) => id !== editorRow?.id);

  // -- storage as authenticated editor --------------------------------------
  section("Storage — authenticated permissions");
  const png = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
    "base64",
  );
  const path = `general/2026/07/${PREFIX}pixel.png`;
  const { error: upErr } = await session.client.storage
    .from("media")
    .upload(path, png, { contentType: "image/png", upsert: true });
  check("authenticated admin CAN upload to 'media'", !upErr, upErr?.message);

  const { error: delErr } = await session.client.storage.from("media").remove([path]);
  check("authenticated admin CAN delete from 'media'", !delErr, delErr?.message);

  // -- 0006 audit column, written by a real session --------------------------
  section("updated_by audit column (migration 0006)");
  await setRole("super_admin");

  const { data: mediaRow } = await admin
    .from("media")
    .insert({
      bucket_id: "media",
      storage_path: `general/2026/07/${PREFIX}audit.png`,
      file_name: `${PREFIX}audit.png`,
      mime_type: "image/png",
      size_bytes: png.length,
      alt_text: "audit test",
      consent_verified: true,
    })
    .select("id")
    .single();
  if (mediaRow?.id) created.media.push(mediaRow.id);

  const { data: gItem, error: gErr } = await session.client
    .from("gallery_items")
    .insert({ media_id: mediaRow.id, caption: `${PREFIX}item`, updated_by: session.userId })
    .select("id, updated_by")
    .single();
  check("gallery_items accepts updated_by on INSERT", !gErr && !!gItem?.id, gErr?.message);
  check("gallery_items.updated_by persisted correctly", gItem?.updated_by === session.userId);
  if (gItem?.id) created.galleryItems.push(gItem.id);

  const { data: gUpd, error: gUpdErr } = await session.client
    .from("gallery_items")
    .update({ caption: "updated", updated_by: session.userId })
    .eq("id", gItem.id)
    .select("updated_by")
    .single();
  check("gallery_items accepts updated_by on UPDATE", !gUpdErr, gUpdErr?.message);
  check("updated_by still correct after UPDATE", gUpd?.updated_by === session.userId);

  await cleanup();

  section("Summary");
  console.log(`  ${passed} passed, ${failed} failed`);
  if (failures.length) {
    console.log("\nFailures:");
    for (const f of failures) console.log(`  - ${f}`);
  }
  process.exit(failed === 0 ? 0 : 1);
}

async function cleanup() {
  section("Cleanup");
  await setRole("super_admin");
  if (created.galleryItems.length)
    await admin.from("gallery_items").delete().in("id", created.galleryItems);
  if (created.media.length) await admin.from("media").delete().in("id", created.media);
  const { data: leftovers } = await admin.from("programs").select("id").like("slug", `${PREFIX}%`);
  if (leftovers?.length) await admin.from("programs").delete().like("slug", `${PREFIX}%`);
  const { data: after } = await admin.from("programs").select("id").like("slug", `${PREFIX}%`);
  check("all auth-test rows removed", (after?.length ?? 0) === 0);
  const { data: finalRole } = await admin
    .from("profiles")
    .select("role")
    .eq("email", email)
    .single();
  check("test user restored to super_admin", finalRole?.role === "super_admin", finalRole?.role);
}

main().catch(async (err) => {
  console.error("\nAborted:", err.message);
  try {
    await cleanup();
  } catch {
    console.error("Cleanup failed — check for rows prefixed", PREFIX);
  }
  process.exit(1);
});
