# One-time setup

## 1. GitHub repository

- Private repo, default branch `main`.
- Settings → General: allow **squash** only; enable **Allow auto-merge**; enable **Automatically delete head branches**.
- Labels: run workflow **labels** once (Actions → labels → Run workflow).
- Ruleset on `main` (GitHub Pro / Team; on Free private repos it isn't available, the `auto-merge` job then waits for checks itself and merges): require PR · required checks `ci`, `pr-meta`, `review-gate` · block force push · **no required approvals** (`review-gate` decides).

## 2. GitHub App (agent identity)

Needed so agent label changes and PRs trigger the next workflows.

1. Settings → Developer settings → GitHub Apps → New. Name e.g. `margot-site-agent`. No webhook.
2. Repository permissions: Contents **RW**, Issues **RW**, Pull requests **RW**, Metadata R. (Workflows RW only if agents may touch `.github/`.)
3. Install it on the repo. Generate a private key.
4. Repo → Settings → Secrets and variables → Actions:

| Kind                | Name                                                                                  | Value                                                                        |
| ------------------- | ------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Secret              | `AGENT_APP_PRIVATE_KEY`                                                               | the `.pem` content                                                           |
| Secret              | `CLAUDE_CODE_OAUTH_TOKEN`                                                             | Claude Pro/Max subscription token: `claude setup-token`. Used first when set |
| Secret (fallback)   | `ANTHROPIC_API_KEY`                                                                   | API key from console.anthropic.com                                           |
| Secret | `CI_DATABASE_URL` | Atlas URL `…/margot-ci` (CI user). Used by `ci`, `develop`, `@claude` builds |
| Variable            | `AGENT_APP_ID`                                                                        | App ID                                                                       |
| Variable            | `AGENT_APP_SLUG`                                                                      | App slug, e.g. `margot-site-agent`                                           |
| Variable (optional) | `CLAUDE_DEBUG`                                                                        | `true` prints full agent output in Actions logs                              |
| Variable (optional) | `CLAUDE_MODEL_TRIAGE`, `CLAUDE_MODEL_PLAN`, `CLAUDE_MODEL_DEV`, `CLAUDE_MODEL_REVIEW` | override default models                                                      |

## 3. MongoDB Atlas

- One cluster (same region as Vercel functions, e.g. Paris `eu-west-3` / Vercel `cdg1`). Free/Flex tier is enough to start.
- Three databases: `margot-prod` (live site), `margot-preview` (Vercel previews + local dev), `margot-ci` (GitHub Actions builds, stays empty). One database user each, `readWrite` on its database only.
- No local MongoDB, no Docker: everyone, agents included, uses Atlas.
- Network access: Vercel functions have dynamic IPs → allow `0.0.0.0/0` (auth via user/password) or use the Atlas ↔ Vercel integration.

## 4. Amazon S3

- One bucket (e.g. `margot-dauban-media`, region `eu-west-3`), **Block Public Access on**: files are served through Payload (`/api/media/file/…`) and optimized by `next/image`.
- One IAM user with a policy limited to that bucket (`s3:GetObject`, `s3:PutObject`, `s3:DeleteObject`, `s3:ListBucket`). Prefixes `prod/` and `preview/` separate environments.

## 5. Vercel

- Import the repo (framework Next.js, root = repo root). Production branch `main`.
- Env vars:

| Var                                        | Production                | Preview                      |
| ------------------------------------------ | ------------------------- | ---------------------------- |
| `DATABASE_URL`                             | Atlas URL `…/margot-prod` | Atlas URL `…/margot-preview` |
| `PAYLOAD_SECRET`                           | `openssl rand -base64 32` | another one                  |
| `S3_BUCKET`, `S3_REGION`                   | bucket, region            | same                         |
| `S3_PREFIX`                                | `prod`                    | `preview`                    |
| `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY` | IAM user                  | same                         |

- First deploy → open `/admin` on production → create the designer's account. Do the same on a preview for test content.

## 6. People

- Designer: install Claude Code (desktop app or VS Code extension), clone the repo, get `.env` values (preview database URL) from a maintainer, accept the **ponytail** plugin prompt, `gh auth login`. Then `/request` and `/build` (see `docs/designer-guide.md`).
- Maintainers: approve plans, review `pr:human-review` PRs.
