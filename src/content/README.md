# Content

Structured, version-controlled content lives here (content-as-code).

Per the approved Phase 1 architecture, the site ships with content authored in
the repository (typed data / MDX) rather than a CMS. This keeps the site fast,
free to host, perfectly SEO-indexable, and durable across contributor handoffs.
A Supabase-backed admin can be layered on later **if** non-technical editors
need self-service — without rewriting the presentation layer.

- Content shapes are defined in [`src/types/content.ts`](../types/content.ts).
- Dynamic submissions (volunteer, contact, donation pledges) are **not**
  content — they are stored in Supabase from Phase 3 onward.
- No real content is committed until copy, photos, and — critically — **photo
  consent for identifiable children** are confirmed with the organisation.
