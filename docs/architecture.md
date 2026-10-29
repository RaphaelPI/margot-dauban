# Architecture

## Stack

| Layer       | Choice                                                                     | Notes                                                           |
| ----------- | -------------------------------------------------------------------------- | --------------------------------------------------------------- |
| App         | Next.js 16, App Router, React 19, `cacheComponents` + `partialPrefetching` | Single app, no monorepo                                         |
| CMS         | Payload 3, mounted in Next                                                 | Admin `/admin` (French), REST `/api/*`, GraphQL disabled        |
| Database    | MongoDB Atlas                                                              | `@payloadcms/db-mongodb`                                        |
| Media       | Amazon S3                                                                  | `@payloadcms/storage-s3`; local dev without S3 writes `./media` |
| UI          | shadcn/ui (radix-nova) + Tailwind 4                                        | `components.json`, tokens in `src/app/(frontend)/globals.css`   |
| Validation  | zod                                                                        | env, server action inputs, external data                        |
| Lint/format | Biome                                                                      | `biome.json`                                                    |
| Tests       | Vitest                                                                     | `src/**/*.test.ts`                                              |
| Hosting     | Vercel                                                                     | Production = `main`, Preview = every PR                         |

## Request flow

```
Browser ──▶ Next.js (Vercel)
            ├─ (frontend) pages ── model components ('use cache', by id) ──Local API──▶ MongoDB
            ├─ /admin            Payload admin (editors, cookie auth)
            └─ /api/*            Payload REST (used by the admin)
Payload hooks (afterChange/afterDelete) ──revalidateTag──▶ Next cache
```

- Site content is read on the server with the Payload **Local API** (`src/lib/payload.ts`, `server-only`). No client fetching of content.
- Access: `publishedOrLoggedIn` on content collections (REST hides drafts from anonymous users). The Local API bypasses access control, so front-end queries filter `_status: published` themselves.

## Caching model

Goal: every model-related component is cached **for life, by id**, and refreshed only when Payload says that doc changed.

| Piece                                                                     | Where                   | Cache key     | Tag                                                        |
| ------------------------------------------------------------------------- | ----------------------- | ------------- | ---------------------------------------------------------- |
| Model component (`<ProjectCard id>`, `<ProjectView id>`, `<PageView id>`) | `src/components/models` | its `id` prop | `projects:<id>` + each related doc rendered (`media:<id>`) |
| Id lookups (`getProjectIds`, `getProjectIdBySlug`)                        | `src/data`              | arguments     | `projects`                                                 |
| Globals (`getSettings`)                                                   | `src/data`              | —             | `global:settings`                                          |

- Lifetime: custom profile `cacheLife('model')` in `next.config.ts` (revalidate 1 year, expire just over 1 year). Time-based refresh is only a safety net.
- Invalidation: `src/lib/cache.ts` adds `afterChange`/`afterDelete` hooks to **every** collection and global (wrapped in `payload.config.ts`). A change expires `<collection>:<id>` and `<collection>`; a global change expires `global:<slug>`. Uses `revalidateTag(tag, { expire: 0 })` (hooks are not Server Actions, so no `updateTag`): the next request renders fresh content.
- Drafts: saving a draft of an unpublished doc invalidates nothing. Publishing or unpublishing does.
- Scripts running outside Next (seed, migrations) pass `context: { disableRevalidate: true }`.
- Dynamic routes (`/projets/[slug]`, `/[slug]`) render a static shell and read `params` inside `<Suspense>`. Unknown slugs render the not-found UI with `noindex`, but HTTP status is 200 (the shell has already streamed). Acceptable for now; `generateStaticParams` would fix it for known slugs, but it must return ≥ 1 entry under `cacheComponents`, which breaks builds on an empty DB.

## Content model

Extracted from margotdauban.fr (WordPress) and the V4 home design. Field names English, labels French. After any change: `pnpm generate` (types + admin import map), committed.

| Slug | Kind | Drafts | Holds | Rendered by |
|---|---|---|---|---|
| `projects` | collection | yes | Card (type, sector, accroche, cover), case study (intro, interventions, hero, contexte & objectifs, contraintes, démarche steps with images, chiffres clés, résultats, site link, galerie), SEO, `featured` | `ProjectCard`, `ProjectView` |
| `testimonials` | collection (orderable) | no | quote + highlighted phrase, author, role, company, photo, project | `TestimonialQuote` |
| `clients` | collection (orderable) | no | name, logo, url (home marquee) | `ClientName` |
| `services` | collection (orderable) | no | expertise group: title, description, full list, short home list, `showOnHome` | `ServiceCard` |
| `faqs` | collection (orderable) | no | question, answer, category (6 fixed) | — (FAQ page to build) |
| `pages` | collection | yes | free text pages: à propos, mentions légales, confidentialité; SEO | `PageView` |
| `media` | collection (upload, S3) | no | images with required alt | `MediaImage` inside model components |
| `users` | collection (auth) | no | admin login | — |
| `home` | global | no | hero, stats, project selection (or featured), testimonial, expertise titles, CTA | home page |
| `settings` | global | no | identity, photo, availability, header nav + button, footer, default SEO | header, footer, metadata |

Not modelled yet (features to request): contact form + submissions, `/projets` list, `/prestations` and `/faq` pages.

## Environments

| Git         | Vercel     | Atlas database                            | S3 prefix        |
| ----------- | ---------- | ----------------------------------------- | ---------------- |
| `main`      | Production | `margot-prod`                             | `prod`           |
| PR branches | Preview    | `margot-preview` (shared by all previews) | `preview`        |
| local | — | `margot-preview` | none (`./media`) |

Real content is written in the **production admin**. The preview database holds test content; edits there never reach the live site.

## Env vars

| Var                                        | Where                                      |                                                                                    |
| ------------------------------------------ | ------------------------------------------ | ---------------------------------------------------------------------------------- |
| `DATABASE_URL`                             | Vercel (Production, Preview), local `.env` | Atlas SRV URL incl. database name; local = `margot-preview` |
| `PAYLOAD_SECRET`                           | Vercel (per env), local `.env`             | `openssl rand -base64 32`, different per env, ≥ 32 chars                           |
| `S3_BUCKET`, `S3_REGION`, `S3_PREFIX`      | Vercel (per env)                           | Required on Vercel (read-only filesystem), checked by `src/lib/env.ts`             |
| `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY` | Vercel (per env)                           | IAM user limited to the bucket                                                     |

Local: Next and the Payload CLI load `.env`.
