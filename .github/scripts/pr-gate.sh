#!/usr/bin/env bash
# Usage: pr-gate.sh <pr-number>
# Deterministic auto-merge eligibility. Prints "eligible" or the reason it is not.
# The reviewer agent may only choose pr:auto-merge when this prints "eligible".
set -euo pipefail
MAX_LINES=${MAX_LINES:-80}
MAX_FILES=${MAX_FILES:-8}
# Paths that always need a human: content model, access, Payload config/admin, cache layer,
# env, CI/agents, deps, config files.
SENSITIVE='^(src/collections/|src/globals/|src/access/|src/migrations/|src/payload\.config\.ts|src/payload-types\.ts|src/app/\(payload\)/|src/lib/(cache|env|payload)\.ts|\.github/|\.claude/|pnpm-lock\.yaml|biome\.json|components\.json)|(^|/)package\.json$|(^|/)next\.config\.|(^|/)\.env'

pr=$(gh pr view "$1" --json title,additions,deletions,files,labels)
lines=$(jq '.additions + .deletions' <<<"$pr")
files=$(jq '.files | length' <<<"$pr")
hits=$(jq -r '.files[].path' <<<"$pr" | grep -E "$SENSITIVE" || true)
flags=$(jq -r '.labels[].name | select(. == "security" or . == "breaking-change")' <<<"$pr")

if [[ $(jq -r .title <<<"$pr") =~ ^[a-z]+(\(.+\))?!: ]]; then echo "breaking change in title"
elif [[ -n $flags ]]; then echo "labelled $flags"
elif ((lines > MAX_LINES)); then echo "$lines changed lines (max $MAX_LINES)"
elif ((files > MAX_FILES)); then echo "$files files (max $MAX_FILES)"
elif [[ -n $hits ]]; then echo "sensitive paths: $(tr '\n' ' ' <<<"$hits")"
else echo eligible
fi
