# CMS framework

The admin application that every content editor is built inside. Phase 5B ships
the **framework**; the editors themselves arrive in Phase 5C.

> **Design philosophy:** the public site is warm and handcrafted; the CMS is
> calm, dense and utilitarian. It is a tool, optimised for volunteers who were
> never trained on it.

---

## 1. Routing

```
src/app/
├── (admin)/admin/          ← protected. Everything here requires a session.
│   ├── layout.tsx          ← auth gate + AdminShell + ToastProvider
│   ├── page.tsx            ← dashboard
│   ├── loading.tsx         ← skeleton matching the dashboard's shape
│   ├── error.tsx           ← calm error boundary with retry
│   └── not-found.tsx       ← 404 inside the shell
└── (auth)/admin/login/     ← public. Deliberately a SEPARATE route group.
    ├── page.tsx
    └── login-form.tsx
```

**Why login lives outside `(admin)`:** if it inherited the protected layout, an
unauthenticated visitor would be redirected to login… by login. Route groups
don't affect the URL, so `/admin/login` still reads naturally.

`export const dynamic = "force-dynamic"` on the admin layout: every CMS page is
per-user, so none may be prerendered or cached.

### Auth gate, three layers

| Layer                 | Checks         | Purpose                                                       |
| --------------------- | -------------- | ------------------------------------------------------------- |
| `middleware.ts`       | session exists | Fast redirect before rendering                                |
| admin `layout`        | session exists | Real gate (middleware can be bypassed by direct RSC requests) |
| RLS + `requireRole()` | role           | The actual authority                                          |

When Supabase isn't configured, middleware steps aside and the layout renders a
"CMS not configured" screen instead of an error.

---

## 2. Layout

`<AdminShell>` is the only CMS layout. It provides the sidebar, top bar,
breadcrumbs, account menu and content container — a page never rebuilds them.

```
AdminShell
├── aside   — sticky sidebar (desktop) · SidebarNav
├── header  — MobileSidebar · Breadcrumbs · UserMenu
└── main    — #admin-content, max-w-6xl
```

A Server Component; only the interactive leaves (`SidebarNav`, `MobileSidebar`,
`UserMenu`) are client-side.

**Theming:** the shell applies `.admin`, which retunes a few _semantic tokens_
(cooler neutrals, tighter radii) in `globals.css`. There is no second component
library — the same `Button`, `Card` and `Input` are reused, and simply look
calmer in this context.

---

## 3. Navigation

Driven by `src/config/admin-nav.ts` — data, not markup:

```ts
{ label: "Programs", href: "/admin/programs", icon: "programs", minRole: "admin", enabled: false }
```

- `icon` is a **name**, resolved through the registry in `layout/icons.tsx`, so
  the config stays serialisable (and could later come from the database).
- `minRole` hides entries the user can't use.
- `enabled: false` renders a non-interactive "Soon" row — the shape of the CMS
  is visible, but nothing links to a page that doesn't exist.

Breadcrumbs derive from the URL and look labels up in the same config, so pages
never declare their own trail.

---

## 4. Building a new CMS page

Everything is exported from `@/components/admin`.

```tsx
export default async function ProgramsPage({ searchParams }) {
  const user = await requireEditor();
  const { rows, total, page, pageSize, pageCount } = await programsRepository.list(...);

  return (
    <>
      <AdminPageHeader
        title="Programs"
        description="Everything shown in the Programs section of the website."
        actions={<Can role={user.role} minimum="editor"><Button>New program</Button></Can>}
      />
      <ProgramsTable rows={rows} … />   {/* a small Client Component */}
    </>
  );
}
```

Fetch on the server, render the interactive table in a thin Client Component.

---

## 5. Tables

`DataTable` + `TableToolbar` + `TablePagination`, all sharing `useTableParams`.

**Table state lives in the URL** (`?q=&sort=&page=`). That choice makes views
shareable and bookmarkable, keeps the back button working, and lets Server
Components read `searchParams` and fetch exactly the right rows — no client data
store.

- `columns` are declarative: `{ id, header, cell, sortable, className }`
- responsive by hiding columns (`className: "hidden md:table-cell"`), not by
  switching to a card layout — one markup path, one mental model
- accessibility: real `<table>`, `<th scope="col">`, `aria-sort`, sr-only caption
- selection and bulk actions are opt-in via the `selection` prop

---

## 6. Forms

`useAdminForm` + `<Form>` + `<FormField>`.

```tsx
const { form, submit } = useAdminForm<ProgramInput, Program>({
  schema: programSchema, // the SAME schema the Server Action parses
  defaultValues: program,
  action: updateProgram,
  successMessage: "Program saved",
});

<Form form={form} onSubmit={submit}>
  <FormField name="title" label="Title" required>
    {({ field, controlProps }) => <Input {...field} {...controlProps} />}
  </FormField>
</Form>;
```

Guarantees you get for free:

- one schema for client and server — they cannot disagree
- server `fieldErrors` attach to the right inputs; other failures become toasts
- `<fieldset disabled>` freezes the whole form while submitting
- `<Field>` wires `id`, `aria-describedby`, `aria-invalid` and `role="alert"`
- `mode: "onTouched"` — validate on blur, then live, so typing isn't punished

---

## 7. Feedback

| Component       | Use for                                                                                                                 |
| --------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `ConfirmDialog` | Consequential actions. `destructive` for deletes; `confirmPhrase` forces the user to type a name for irreversible ones. |
| `Panel`         | `modal` (short tasks) or `drawer` (edit beside a list) — one API, two presentations.                                    |
| `useToast`      | Success/error notifications. Errors persist until dismissed; successes auto-hide.                                       |

---

## 8. Media primitives

`Dropzone` (a real `<label for>` + file input, so it's keyboard accessible with
no custom key handling) and `MediaCard`, which surfaces the two mistakes that
matter: **missing alt text** and **consent not verified**. Both mirror
`validation/media.ts`; the Server Action and bucket re-validate.

The full media library is Phase 5C.

---

## 9. Permissions in the UI

```tsx
<Can role={user.role} minimum="admin">
  <Button variant="destructive">Delete</Button>
</Can>
```

`Can` and the nav's `minRole` are **UX only** — they reduce noise and prevent
avoidable errors. Authorization is enforced by RLS and `requireRole()`; never
rely on the UI to protect data.

---

## 10. Editors (Phase 5C)

| Editor        | Route             | Shape                                |
| ------------- | ----------------- | ------------------------------------ |
| Homepage      | `/admin/pages`    | Single form (hero, mission, SEO)     |
| Programs      | `/admin/programs` | List + create/edit + delete          |
| Stories       | `/admin/stories`  | List + create/edit (Markdown body)   |
| Gallery       | `/admin/gallery`  | Grid + image picker + per-item panel |
| Media library | `/admin/media`    | Grid + upload + metadata + delete    |
| Site settings | `/admin/settings` | Single form (admin only)             |

### Adding another editor

1. **Actions** — a `"use server"` file delegating to `createEntityActions`:

   ```ts
   const actions = createEntityActions({
     table: "events",
     createSchema: eventSchema,
     updateSchema: eventUpdateSchema,
     revalidate: ["/admin/events", "/events"],
   });
   export async function createEvent(input: unknown) {
     return actions.create(input);
   }
   ```

2. **List page** — server component reading `searchParams`, calling
   `repository.list({ search: { term, columns } })`, rendering a table.
3. **Form** — one component for new _and_ edit, wrapped in `EditorForm`.

No CRUD, validation, permission or save-bar logic is written per editor.

> **`"use server"` gotcha:** every export of such a module must be an async
> function. A stray `export const` silently voids _all_ exports and the build
> fails with "export doesn't exist". Keep constants module-local.

### Where each thing is edited

One piece of content has exactly one home:

- Featured programs / gallery images → the `Featured` flag on the item itself
- Primary CTA and campaign band → Site settings
- Alt text and guardian consent → Media library

### Form field rules (learned the hard way)

- **Images:** use `<ImageFormField name="coverMediaId" …>`. It binds the media
  **id** to React Hook Form via a `Controller`. An earlier version kept the
  selection in local state and mirrored it into a hidden input — which never
  called `onChange`, so picking an image silently saved nothing. The raw
  `ImageField` is deliberately not exported for this reason.
- **Booleans:** use `<CheckboxFormField>` — `Field` is laid out for text inputs.
- **Numbers:** schemas must use `z.coerce.number()`. A `<input type="number">`
  hands RHF a _string_, and a plain `z.number()` rejects it, so every save with
  an order value fails.
- **Media previews:** resolve server-side with `getMediaUrl(id)` from
  `@/server/media-url` — never re-query storage in a page.
- **Destructive row actions:** a row menu unmounts on close and takes a nested
  dialog with it. Render one `ConfirmDialog` with `open`/`onOpenChange` driven
  by state instead (see `programs-table.tsx`).

### Deferred deliberately

- **Drag-and-drop ordering** — numeric `order_index` for now. A
  `reorderGalleryItems` action already exists; drag-and-drop needs a dependency
  plus a keyboard-accessible alternative, which the brief allows postponing.
- **Rich text** — Markdown in a textarea. No editor dependency, portable
  content, and no WYSIWYG emitting markup the public site can't style.

---

## 11. Conventions

- Import from `@/components/admin`, never deep paths.
- Server Components by default; `"use client"` only at interactive leaves.
- Use `AdminPageHeader` on every page — it owns the `<h1>`.
- Use the design system's `Button`/`Input`/`Card`; don't create admin variants.
- Data access goes through Phase 5A repositories, never `supabase.from()` inline.
