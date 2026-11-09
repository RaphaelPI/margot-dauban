# Architecture

## Stack

| Layer       | Choice                                                                     | Notes                                                           |
| ----------- | -------------------------------------------------------------------------- | --------------------------------------------------------------- |
| App         | Next.js 16, App Router, React 19, `cacheComponents` (`partialPrefetching: false`, see decisions #22) | Single app, no monorepo                                         |
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
| Model component (`<ProjectCard id>`, `<ProjectView id>`, `<ProjectNextCard id>`, `<PageView id>`) | `src/components/models` | its `id` prop | `projects:<id>` + each related doc rendered (`media:<id>`) |
| Id lookups (`getProjectIds`, `getProjectIdBySlug`)                        | `src/data`              | arguments     | `projects`                                                 |
| Globals (`getSettings`)                                                   | `src/data`              | —             | `global:settings`                                          |

- Lifetime: custom profile `cacheLife('model')` in `next.config.ts` (`revalidate` and `expire` = `Infinity`): no time-based refresh, entries only change when a Payload hook expires their tag.
- Invalidation: `src/lib/cache.ts` adds `afterChange`/`afterDelete` hooks to **every** collection and global (wrapped in `src/collections/index.ts` / `src/globals/index.ts`). A change expires `<collection>:<id>` and `<collection>`; a global change expires `global:<slug>`. Uses `revalidateTag(tag, { expire: 0 })` (hooks are not Server Actions, so no `updateTag`): the next request renders fresh content.
- Drafts: saving a draft of an unpublished doc invalidates nothing. Publishing or unpublishing does.
- Scripts running outside Next (seed, migrations) pass `context: { disableRevalidate: true }`.
- Dynamic routes (`/projets/[slug]`, `/projets/categorie/[slug]`, `/[slug]`) use `generateStaticParams` (published slugs, `src/data/ids.ts`; category filters are paths, never `searchParams`): every page is prerendered as full HTML, no `<Suspense>`, nothing streamed at request time. A slug published after the build renders on its first visit, then is cached; tag expiry refreshes it. Empty DB: a `_` placeholder param keeps the build working (`cacheComponents` needs ≥ 1 entry) and renders the 404. Unknown slugs return HTTP 404.

## Content model

Extracted from margotdauban.fr (WordPress) and the V4 home design. Field names English, labels French. After any change: `pnpm generate` (types + admin import map), committed.

| Slug | Kind | Drafts | Holds | Rendered by |
|---|---|---|---|---|
| `projects` | collection (orderable) | yes | Card (type, sector, accroche, cover), case study in two parts — résumé (headline, hero, défi / réponse / interventions, chiffres clés, galerie, steps in short, objectives, site link) and détail (contexte, objectives and constraints as cards, steps with text and images) — plus contact band (`cta`), section titles editable; legacy `lead` and `constraints` rich text kept but not rendered; `categories`, SEO, `featured` | `ProjectCard`, `ProjectView`, `ProjectNextCard` |
| `project-categories` | collection (orderable) | no | title, slug (filters of `/projets`, `?categorie=<slug>`) | `ProjectCategoryFilter` |
| `clients` | collection (orderable) | no | name, logo, url (home marquee) | `ClientName` |
| `services` | collection (orderable) | no | expertise group: title, description, full list, short home list, `showOnHome` | `ServiceCard` |
| `faqs` | collection (orderable) | no | question, answer, category (6 fixed) | — (FAQ page to build) |
| `pages` | collection | yes | free text pages: à propos, mentions légales, confidentialité; SEO | `PageView` |
| `media` | collection (upload, S3) | no | images with required alt | `MediaImage` inside model components |
| `users` | collection (auth) | no | admin login | — |
| `home` | global | no | hero, stats, project selection (or featured), expertise titles, CTA | home page |
| `faq-page` | global | no | eyebrow, title (« & » in indigo), intro, CTA, SEO for `/faq`; questions from `faqs` grouped by `faqCategories` | `/faq` page |
| `projects-page` | global | no | title, highlight, intro, contact band (`cta`), SEO for `/projets` | `/projets` page |
| `services-page` | global | no | hero (title, highlight, lead, body, callout, portrait), expertises title, process (eyebrow, title, intro, ≤ 4 steps with screen label), team (title, text, labels), CTA, SEO for `/expertises` | `/expertises` page, `ProcessShowcase` |
| `settings` | global | no | identity, photo, availability, header nav + button, footer, default SEO | header, footer, metadata |

Not modelled yet (features to request): contact form + submissions, `/projets` list, `/expertises` and `/faq` pages.

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
