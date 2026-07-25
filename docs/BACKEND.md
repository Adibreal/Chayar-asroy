# Backend architecture

The platform the CMS runs on: Supabase (Postgres + Auth + Storage) behind a
small, strongly-typed server layer in Next.js.

> **Design rule:** the database is the authority. Every permission is enforced
> by Row Level Security; the UI and server helpers add clarity and good errors,
> never the actual guarantee.

---

## 1. Setup

The site builds and renders without Supabase — the backend degrades gracefully
until it's configured.

1. Create a project at [supabase.com](https://supabase.com).
2. Fill in `.env.local` (see `.env.example`):
   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` — public, safe
     in the browser; protected by RLS.
   - `SUPABASE_SERVICE_ROLE_KEY` — **server only**, bypasses RLS.
3. Run the migrations in order, then the seed:

```bash
pnpm dlx supabase link --project-ref <ref>
pnpm dlx supabase db push
```

4. Regenerate types so they can never drift from the schema:

```bash
pnpm dlx supabase gen types typescript --project-id <ref> > src/types/database.ts
```

5. Create the first user in the Supabase dashboard, then promote them:

```sql
update public.profiles set role = 'super_admin' where email = 'you@example.com';
```

---

## 2. Folder map

| Path                       | Responsibility                                          |
| -------------------------- | ------------------------------------------------------- |
| `src/lib/supabase/`        | Client factories only — no business logic               |
| `src/server/auth/`         | Session helpers + sign-in/out actions                   |
| `src/server/db/`           | Generic repository, pagination, error unwrapping        |
| `src/server/repositories/` | Per-entity data access (compose the generic repository) |
| `src/server/storage/`      | Upload/delete/URL helpers for media                     |
| `src/server/actions/`      | `createAction()` — the Server Action factory            |
| `src/server/shared/`       | `AppError`, `Result`                                    |
| `src/validation/`          | Zod schemas (the single source of input truth)          |
| `supabase/migrations/`     | Schema, RLS, storage — the database's source of truth   |

**Never** call `supabase.from(...)` directly from a component. Go through a
repository so RLS, typing and error translation stay consistent.

---

## 3. The four Supabase clients

| Client                       | Where                       | Runs as | RLS |
| ---------------------------- | --------------------------- | ------- | --- |
| `lib/supabase/client.ts`     | Client Components           | user    | ✅  |
| `lib/supabase/server.ts`     | RSC, Server Actions, routes | user    | ✅  |
| `lib/supabase/middleware.ts` | `middleware.ts` only        | user    | ✅  |
| `lib/supabase/admin.ts`      | Server only, rare           | service | ❌  |

`admin.ts` imports `server-only`, so importing it from a Client Component is a
**build error**, not a runtime leak. Reach for it only when RLS genuinely can't
express the rule (e.g. a super admin inviting a user).

---

## 4. Authentication flow

```
Request → middleware.ts → updateSession() → supabase.auth.getUser()
                                              │
                         ┌────────────────────┴────────────────────┐
                    no user + /admin                          user present
                         │                                         │
              redirect /admin/login?next=…                  refreshed cookies
```

- `getUser()` is used everywhere, never `getSession()` — it revalidates the JWT
  with the auth server. Cookie data alone must never be trusted for
  authorization.
- Cookies are written to the same `NextResponse` that is returned, or the
  refreshed session would be lost.
- Middleware only checks **authentication**. Authorization happens in RLS and
  in `requireRole()`.

---

## 5. Authorization model

Three roles, ordered by privilege:

| Role          | Read draft | Create/Edit | Delete | Manage people |
| ------------- | ---------- | ----------- | ------ | ------------- |
| `editor`      | ✅         | ✅          | ❌     | ❌            |
| `admin`       | ✅         | ✅          | ✅     | ❌            |
| `super_admin` | ✅         | ✅          | ✅     | ✅            |

Anonymous visitors read **published rows only**.

Enforced in three layers:

1. **RLS policies** (`0003_rls.sql`) — the authority.
2. **`requireRole()`** — clear errors and protection for non-database side
   effects such as uploads.
3. **UI** — hides what the user can't do. UX only; never a guarantee.

SQL helpers `current_user_role()`, `can_edit()`, `is_admin()` and
`is_super_admin()` are `SECURITY DEFINER` with a pinned `search_path` — required
so that reading `profiles` inside a `profiles` policy can't recurse, and so the
functions can't be hijacked via a mutable search path.

**Privilege escalation** is blocked by the `profiles_guard_privileged_change`
trigger: a policy can't compare `OLD` and `NEW`, so a trigger does. It protects
both `role` and `is_active`, so a user can neither promote themselves nor
reactivate a suspended account.

---

## 6. Storage

Two buckets:

| Bucket      | Visibility | Contents                          | Limit |
| ----------- | ---------- | --------------------------------- | ----- |
| `media`     | public     | every image the site renders      | 10 MB |
| `documents` | private    | internal files (signed URLs only) | 20 MB |

Path convention: `<folder>/<yyyy>/<mm>/<uuid>.<ext>` — date-partitioned so no
folder grows unbounded, UUID-named so uploads can't collide or leak filenames.

`src/server/storage/media.ts` is the **only** place that touches storage.
Ordering there is deliberate:

- **Upload:** file first, then the row; if the row fails, the object is
  removed, so storage never holds an unreferenced file.
- **Delete:** row first, then the object; if the object delete fails, the file
  is merely orphaned rather than the row pointing at nothing.

---

## 7. Shared patterns

### Result, not exceptions

Every Server Action returns `Result<T>` — a discriminated union on `ok`. Errors
cross the wire as plain data (`code`, `message`, optional `fieldErrors`), so no
stack trace ever reaches the browser.

### `createAction()`

Wraps authorize → validate → execute → revalidate → normalize. Writing actions
through it means none can accidentally skip auth or validation:

```ts
export const updateProgram = createAction({
  input: programUpdateSchema,
  role: "editor",
  revalidate: ["/programs"],
  handler: async ({ input, user }) => programsRepository.update(input.id, { ... }),
});
```

### Generic repository

`createRepository("table")` provides `list` (paginated, filtered),
`findById`, `findBy`, `findOptional`, `create`, `update`, `remove`. Entities
needing more compose it — see `repositories/programs.ts`.

### Error translation

`fromPostgrestError()` maps Postgres codes to `AppError`s once, centrally:
`23505 → CONFLICT`, `42501 → FORBIDDEN` (an RLS denial), `PGRST116 → NOT_FOUND`.

---

## 8. Child-safety guarantee

Publishing a gallery item whose media lacks `consent_verified` raises a
database exception (`gallery_items_require_consent`). This is intentionally a
**database** rule, not a UI convention, so no future editor, script or bug can
publish a child's photograph without recorded guardian consent.

---

## 9. Extending the platform

**A new content type:** migration (table + trigger + RLS following the existing
pattern) → add to `Database` → `createRepository()` → Zod schema → actions via
`createAction()`.

**A new role:** `alter type public.user_role add value …`, update `ROLE_RANK`
and the SQL helpers.

**A new social platform:** insert a `social_links` row — no code change.

**A new upload location:** add a folder to `MEDIA_FOLDERS`.

---

## 10. What Phase 5B builds on this

Not yet implemented, by design: admin pages, CRUD editors, media picker UI, the
shared form/table components. They are additive — the primitives above (auth,
repositories, actions, validation, storage, `Result`) are the contract they
will consume.
