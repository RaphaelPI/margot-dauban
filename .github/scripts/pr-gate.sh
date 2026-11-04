#!/usr/bin/env bash
# Usage: pr-gate.sh <pr-number>
# Deterministic merge tier. Prints one of:
#   eligible            → may auto-merge (reviewer agent decides)
#   designer: <reason>  → the designer's approval is enough to merge
#   blocked: <reason>   → a maintainer must approve
# Design references under designs/ never count: they don't run.
set -euo pipefail
MAX_LINES=${MAX_LINES:-80}
MAX_FILES=${MAX_FILES:-8}
# Security, data access, auth (Users), Payload config, cache layer, env, CI/agents, tooling config.
# Registering a collection/global (src/collections|globals/index.ts) is MODEL, not this.
CRITICAL='^(src/access/|src/collections/Users\.ts|src/migrations/|src/payload\.config\.ts|src/lib/(cache|env|payload)\.ts|\.github/|\.claude/|biome\.json|components\.json|tsconfig\.json|scripts/)|(^|/)next\.config\.|(^|/)\.env'
# Content model, generated admin files, dependencies: never auto-merged, but the designer can
# validate them on the preview.
MODEL='^(src/collections/|src/globals/|src/fields/|src/payload-types\.ts|src/app/\(payload\)/|pnpm-lock\.yaml)|(^|/)package\.json$'

pr=$(gh pr view "$1" --json title,files,labels)
code=$(jq '[.files[] | select(.path | startswith("designs/") | not)]' <<<"$pr")
lines=$(jq 'map(.additions + .deletions) | add // 0' <<<"$code")
files=$(jq 'length' <<<"$code")
paths=$(jq -r '.[].path' <<<"$code")
critical=$(grep -E "$CRITICAL" <<<"$paths" || true)
model=$(grep -E "$MODEL" <<<"$paths" || true)
flags=$(jq -r '.labels[].name | select(. == "security" or . == "breaking-change")' <<<"$pr")

if [[ $(jq -r .title <<<"$pr") =~ ^[a-z]+(\(.+\))?!: ]]; then echo "blocked: breaking change in title"
elif [[ -n $flags ]]; then echo "blocked: labelled $(tr '\n' ' ' <<<"$flags")"
elif [[ -n $critical ]]; then echo "blocked: critical paths: $(tr '\n' ' ' <<<"$critical")"
elif [[ -n $model ]]; then echo "designer: content model or dependencies: $(tr '\n' ' ' <<<"$model")"
elif ((lines > MAX_LINES)); then echo "designer: $lines changed lines (auto-merge max $MAX_LINES)"
elif ((files > MAX_FILES)); then echo "designer: $files files (auto-merge max $MAX_FILES)"
else echo eligible
fi
