# Labels

Source of truth: `.github/labels.json` (synced to GitHub by `.github/workflows/labels.yml` on push to `main`).
`status:*` labels are exclusive: always set them with `.github/scripts/set-status.sh <issue> <status>`.

## Type (one per issue)

| Label              | Use for                                                                   |
| ------------------ | ------------------------------------------------------------------------- |
| `type:feature`     | New capability: a new section, page type, interaction, or kind of content |
| `type:bug`         | Something is broken                                                       |
| `type:improvement` | Change an existing feature (layout, behaviour, admin)                     |
| `type:perf`        | Speed, weight, cost                                                       |
| `type:chore`       | Tooling, deps, refactor. No visible change                                |

## Status (exactly one per open issue)

| Label                 | Meaning                          | Set by                                                       | Triggers                                        |
| --------------------- | -------------------------------- | ------------------------------------------------------------ | ----------------------------------------------- |
| `status:draft`        | Parked, nothing runs             | Triage job (Draft box) or a human               | — (add `status:needs-triage` to start)          |
| `status:needs-triage` | New or edited issue to check     | Issue forms, retriage job                        | Triage agent                                    |
| `status:needs-info`   | Incomplete; questions in comment | Triage / architect agent                                     | — (designer edits issue → back to needs-triage) |
| `status:needs-plan`   | Plan required                    | Triage agent, or human (to request plan changes)             | Architect agent                                 |
| `status:plan-review`  | Plan posted, waiting for a human | Architect agent                                              | —                                               |
| `status:agent-ready`  | Go for the developer agent       | Triage agent (no plan needed) or **human (= plan approved)** | Developer agent (after approval guard)          |
| `status:human-ready`  | Go for a human (or `/build`)     | Triage agent or human                                        | —                                               |
| `status:in-progress`  | Being implemented                | Developer agent, `/build`, human                             | —                                               |
| `status:in-review`    | PR open                          | Developer agent, `/build`, human                             | —                                               |
| `status:blocked`      | Agent failed or stuck            | Any workflow on failure                                      | —                                               |

## PR (one tier label per PR into main, plus `pr:designer-approved` once validated)

| Label             | Meaning                                     | Set by                                                   |
| ----------------- | ------------------------------------------- | -------------------------------------------------------- |
| `pr:auto-merge`   | Low risk; merges itself when CI is green    | PR reviewer agent (only if hard gate passes), or a human |
| `pr:designer-review` | Merges when the designer ticks « Valider et fusionner » on the preview | PR reviewer agent |
| `pr:designer-approved` | Designer validated the current version; triggers the merge | `agent-preview.yml` only (review-gate rejects it from anyone else) |
| `pr:human-review` | A maintainer must approve the latest commit | PR reviewer agent / fallback |

## Flags

| Label             | Effect                                                      |
| ----------------- | ----------------------------------------------------------- |
| `priority:urgent` | Live site broken. Fix first                                 |
| `security`        | Forces plan + human review. Never auto-merged               |
| `breaking-change` | Breaks existing content or URLs. Forces plan + human review |
