# Margot Dauban — portfolio

Portfolio of a freelance UI/UX designer, built by humans and agents. Content is edited in the Payload admin. New features come from GitHub issues that Claude agents implement (triage → plan → develop → review), or are built locally with Claude Code by the designer.

## Quickstart

```bash
nvm use                       # Node 24 (≥ 24.22.1)
pnpm install
cp .env.example .env          # DATABASE_URL = Atlas preview URL, PAYLOAD_SECRET: openssl rand -base64 32
pnpm dev                      # maintainers: site http://localhost:3000, admin /admin (needs .env)
```

First visit to `/admin` creates the first user.

## In Claude Code

| Command    | What                                                                                    |
| ---------- | --------------------------------------------------------------------------------------- |
| `/build` | The designer's only entry point: describe a need (+ optional design file) → issue + PR → iterate on the Vercel preview in the chat → « c'est bon » = merged and live |

## Docs

| Doc                                                  | What                                                           |
| ---------------------------------------------------- | -------------------------------------------------------------- |
| [docs/designer-guide.md](docs/designer-guide.md)     | For the designer (French): content, requests, building locally |
| [docs/architecture.md](docs/architecture.md)         | Stack, caching model, content model, environments, env vars    |
| [docs/agentic-workflow.md](docs/agentic-workflow.md) | How issues flow through agents, plan approval, auto-merge      |
| [docs/labels.md](docs/labels.md)                     | Every label and who sets it                                    |
| [docs/issue-format.md](docs/issue-format.md)         | Issue formats and the checklists triage enforces               |
| [docs/intake-questions.md](docs/intake-questions.md) | Questions asked by `/build` (single source)                  |
| [docs/git-flow.md](docs/git-flow.md)                 | Branches, PR rules, deploys, content model changes             |
| [docs/setup.md](docs/setup.md)                       | One-time GitHub / Vercel / Atlas / S3 setup                    |
| [docs/decisions.md](docs/decisions.md)               | Decision log (why things are this way)                         |
| [CLAUDE.md](CLAUDE.md)                               | Rules every agent (and human) follows                          |
