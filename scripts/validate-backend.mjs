/**
 * Phase 5D.0 backend validation — exercises the live Supabase project.
 *
 * Covers the layers a browser cannot reach directly: seed data, Row Level
 * Security as seen by each role, storage upload/URL/delete, and the two
 * database-level guarantees (the child-safety consent gate and the
 * `gallery_items.updated_by` audit column added in migration 0006).
 *
 * The CMS editors themselves are validated through the running app, not here.
 *
 * Run:
 *   node --env-file=.env.local scripts/validate-backend.mjs
 *
 * Safe to re-run: every row it creates is prefixed `zz-validation-` and removed
 * in the same run, and it never touches seed or real content.
 */

import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !anonKey || !serviceKey) {
  console.error(
    "Missing env. Need NEXT_PUBLIC_SUPABASE_URL, *_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY.",
  );
  process.exit(1);
}

const admin = createClient(url, serviceKey, { auth: { persistSession: false } });
const anon = createClient(url, anonKey, { auth: { persistSession: false } });

const PREFIX = "zz-validation-";
let passed = 0;
let failed = 0;
let skipped = 0;
const failures = [];
const skips = [];

/** A validation that could not run — never counted as a pass. */
function skip(name, reason) {
  skipped++;
  skips.push(`${name} — ${reason}`);
  console.log(`  SKIP  ${name} — ${reason}`);
}

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

function section(title) {
  console.log(`\n${title}`);
}

/** Track ids so cleanup runs even when an assertion fails. */
const created = { media: [], galleryItems: [], programs: [], storagePaths: [] };

async function main() {
  // -- 2. Seed ---------------------------------------------------------------
  section("Seed data");

  const { data: settings, error: settingsErr } = await admin
    .from("site_settings")
    .select("id, org_name, primary_cta_href");
  check(
    "site_settings has exactly one row",
    settings?.length === 1,
    settingsErr?.message ?? `got ${settings?.length}`,
  );
  check(
    "site_settings.org_name seeded",
    settings?.[0]?.org_name === "Chayar Asroy",
    settings?.[0]?.org_name,
  );

  const { data: nav } = await admin.from("navigation_items").select("href");
  check(
    "navigation_items has exactly 6 rows (idempotency)",
    nav?.length === 6,
    `got ${nav?.length}`,
  );
  const hrefs = new Set((nav ?? []).map((n) => n.href));
  check("navigation hrefs unique (no duplicate seeding)", hrefs.size === (nav?.length ?? -1));

  const { data: socials } = await admin.from("social_links").select("platform");
  check("social_links has 2 rows", socials?.length === 2, `got ${socials?.length}`);

  // -- 6. RLS ----------------------------------------------------------------
  section("Row Level Security (anonymous role)");

  // Seed a draft + a published program via service role, then read as anon.
  const draftSlug = `${PREFIX}draft`;
  const pubSlug = `${PREFIX}published`;
  for (const [slug, status] of [
    [draftSlug, "draft"],
    [pubSlug, "published"],
  ]) {
    const { data, error } = await admin
      .from("programs")
      .insert({ slug, title: slug, category: "art", summary: "validation row", status })
      .select("id")
      .single();
    if (error) throw new Error(`setup insert failed: ${error.message}`);
    created.programs.push(data.id);
  }

  const { data: anonPrograms } = await anon.from("programs").select("slug");
  const anonSlugs = new Set((anonPrograms ?? []).map((p) => p.slug));
  check("anon CAN read published program", anonSlugs.has(pubSlug));
  check("anon CANNOT read draft program", !anonSlugs.has(draftSlug));

  const { error: anonInsertErr } = await anon
    .from("programs")
    .insert({ slug: `${PREFIX}anon`, title: "x", category: "art", summary: "x" });
  check(
    "anon CANNOT insert a program",
    !!anonInsertErr,
    anonInsertErr ? "" : "insert unexpectedly succeeded",
  );

  // RLS filters UPDATE silently rather than erroring, and PostgREST may report
  // no count at all — so assert on the stored value, which cannot be ambiguous.
  const titleBefore = pubSlug;
  await anon.from("programs").update({ title: "hacked-by-anon" }).eq("slug", pubSlug);
  const { data: afterAnonUpdate } = await admin
    .from("programs")
    .select("title")
    .eq("slug", pubSlug)
    .single();
  check(
    "anon CANNOT update a published program (value unchanged)",
    afterAnonUpdate?.title === titleBefore,
    `title is now "${afterAnonUpdate?.title}"`,
  );

  await anon.from("programs").delete().eq("slug", pubSlug);
  const { data: afterAnonDelete } = await admin
    .from("programs")
    .select("id")
    .eq("slug", pubSlug)
    .maybeSingle();
  check("anon CANNOT delete a published program (row still present)", !!afterAnonDelete?.id);

  const { data: anonProfiles } = await anon.from("profiles").select("id");
  check(
    "anon CANNOT read profiles",
    (anonProfiles?.length ?? 0) === 0,
    `got ${anonProfiles?.length}`,
  );

  const { data: anonNav } = await anon.from("navigation_items").select("href");
  check(
    "anon sees only available nav items (all seeded false)",
    (anonNav?.length ?? -1) === 0,
    `got ${anonNav?.length}`,
  );

  // -- 7/8. Storage ----------------------------------------------------------
  section("Storage");

  const { data: buckets } = await admin.storage.listBuckets();
  const names = new Set((buckets ?? []).map((b) => b.id));
  check("bucket 'media' exists", names.has("media"));
  check("bucket 'documents' exists", names.has("documents"));
  check("bucket 'media' is public", buckets?.find((b) => b.id === "media")?.public === true);
  check(
    "bucket 'documents' is private",
    buckets?.find((b) => b.id === "documents")?.public === false,
  );

  // 1x1 transparent PNG.
  const png = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
    "base64",
  );
  const storagePath = `general/2026/07/${PREFIX}pixel.png`;
  const { error: uploadErr } = await admin.storage
    .from("media")
    .upload(storagePath, png, { contentType: "image/png", upsert: true });
  check("service role can upload to 'media'", !uploadErr, uploadErr?.message);
  if (!uploadErr) created.storagePaths.push(storagePath);

  const { data: pub } = admin.storage.from("media").getPublicUrl(storagePath);
  check(
    "public URL generated",
    typeof pub?.publicUrl === "string" && pub.publicUrl.includes(storagePath),
  );

  if (pub?.publicUrl) {
    const res = await fetch(pub.publicUrl);
    check("public URL is fetchable without auth", res.ok, `HTTP ${res.status}`);
    check(
      "served bytes match uploaded bytes",
      res.ok && Number(res.headers.get("content-length")) === png.length,
    );
  }

  const { error: anonUploadErr } = await anon.storage
    .from("media")
    .upload(`general/2026/07/${PREFIX}anon.png`, png, { contentType: "image/png" });
  check(
    "anon CANNOT upload to 'media'",
    !!anonUploadErr,
    anonUploadErr ? "" : "upload unexpectedly succeeded",
  );

  // -- media row + URL resolution -------------------------------------------
  section("Media library row");

  const { data: mediaRow, error: mediaErr } = await admin
    .from("media")
    .insert({
      bucket_id: "media",
      storage_path: storagePath,
      file_name: `${PREFIX}pixel.png`,
      mime_type: "image/png",
      size_bytes: png.length,
      alt_text: "Validation pixel",
      consent_verified: false,
    })
    .select("id, consent_verified")
    .single();
  check("media row inserted", !mediaErr && !!mediaRow?.id, mediaErr?.message);
  if (mediaRow?.id) created.media.push(mediaRow.id);

  // -- 10. Consent gate + gallery audit column ------------------------------
  section("Child-safety consent gate (DB trigger) and 0006 audit column");

  if (mediaRow?.id) {
    // A draft item is allowed even without consent.
    const { data: item, error: itemErr } = await admin
      .from("gallery_items")
      .insert({ media_id: mediaRow.id, caption: `${PREFIX}item`, status: "draft" })
      .select("id, updated_by")
      .single();
    check(
      "gallery item can be created as draft without consent",
      !itemErr && !!item?.id,
      itemErr?.message,
    );
    if (item?.id) created.galleryItems.push(item.id);

    // Publishing without consent must be refused by the trigger.
    if (item?.id) {
      const { error: publishErr } = await admin
        .from("gallery_items")
        .update({ status: "published" })
        .eq("id", item.id);
      check(
        "publishing WITHOUT consent is blocked by the database",
        !!publishErr,
        publishErr ? "" : "publish unexpectedly succeeded — CHILD SAFETY GATE NOT ENFORCED",
      );

      // Grant consent, then publishing must succeed.
      await admin.from("media").update({ consent_verified: true }).eq("id", mediaRow.id);
      const { error: publishOkErr } = await admin
        .from("gallery_items")
        .update({ status: "published" })
        .eq("id", item.id);
      check("publishing WITH consent succeeds", !publishOkErr, publishOkErr?.message);

      // 0006: updated_by must be writable — this is the column whose absence
      // made every Gallery save fail with PGRST204.
      const { data: profileRow } = await admin.from("profiles").select("id").limit(1).maybeSingle();
      if (profileRow?.id) {
        const { error: auditErr } = await admin
          .from("gallery_items")
          .update({ updated_by: profileRow.id })
          .eq("id", item.id);
        check(
          "gallery_items.updated_by is writable (migration 0006)",
          !auditErr,
          auditErr?.message,
        );
      } else {
        skip("gallery_items.updated_by is writable (migration 0006)", "no profile exists yet");
      }
    }
  }

  await cleanup();

  section("Summary");
  console.log(`  ${passed} passed, ${failed} failed, ${skipped} skipped`);
  if (failures.length) {
    console.log("\nFailures:");
    for (const f of failures) console.log(`  - ${f}`);
  }
  if (skips.length) {
    console.log("\nSkipped (NOT verified):");
    for (const s of skips) console.log(`  - ${s}`);
  }
  process.exit(failed === 0 ? 0 : 1);
}

async function cleanup() {
  section("Cleanup");
  if (created.galleryItems.length)
    await admin.from("gallery_items").delete().in("id", created.galleryItems);
  if (created.media.length) await admin.from("media").delete().in("id", created.media);
  if (created.programs.length) await admin.from("programs").delete().in("id", created.programs);
  if (created.storagePaths.length) await admin.storage.from("media").remove(created.storagePaths);

  const { data: leftoverPrograms } = await admin
    .from("programs")
    .select("id")
    .like("slug", `${PREFIX}%`);
  const { data: leftoverMedia } = await admin
    .from("media")
    .select("id")
    .like("file_name", `${PREFIX}%`);
  check(
    "all validation rows removed",
    (leftoverPrograms?.length ?? 0) === 0 && (leftoverMedia?.length ?? 0) === 0,
  );
}

main().catch(async (err) => {
  console.error("\nValidation aborted:", err.message);
  try {
    await cleanup();
  } catch {
    console.error("Cleanup also failed — check for rows prefixed", PREFIX);
  }
  process.exit(1);
});
