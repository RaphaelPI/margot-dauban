# Git flow and deploys

## Branches

| Branch                                        | Role       | Deploys to                      |
| --------------------------------------------- | ---------- | ------------------------------- |
| `main` (default)                              | Production | Vercel Production (live site)   |
| `feat/<n>-slug`, `fix/…`, `perf/…`, `chore/…` | One issue  | Vercel Preview (one URL per PR) |

No `dev` / `release` branches: every PR has its own preview, and the site is small enough that `main` is the integration branch.

## PR rules

- One issue = one branch = one PR into `main`. Title = Conventional Commit (`feat(projects): add gallery`, `fix!: …` for breaking). Body has `Closes #n`. Enforced by `ci / pr-meta`.
- **Squash merge** only: one commit per issue on `main`.
- Review: see `docs/agentic-workflow.md` (hard gate + reviewer agent + `review-gate`).
- Check the **Vercel preview** before approving any visual change.

## Deploys and rollback

- Merge to `main` → Vercel builds and deploys production. Pages prerender at build against the production database.
- Rollback: Vercel **Instant Rollback** to the previous production deployment. No tags or GitHub Releases: Vercel's deployment list is the history.

## Content model changes

MongoDB has no schema migrations for additive changes.

| Change                                        | How                                                                                                                                                                   |
| --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| New collection, new optional field, new label | Just ship it (`pnpm generate`, commit generated files)                                                                                                                |
| Field required on existing docs               | Ship it optional first, fill the content in the admin, then make it required (second PR)                                                                              |
| Rename / remove a field, change its type      | Expand/contract: add new field → copy data (migration or by hand) → remove old in a later PR. Or a Payload migration (`pnpm payload migrate:create`), see `CLAUDE.md` |

Old production code may run against new data during a deploy: every change must work with both.
