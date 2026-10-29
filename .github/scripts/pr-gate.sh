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
# Security, data access, Payload admin/config, cache layer, env, CI/agents, deps, config files.
CRITICAL='^(src/access/|src/migrations/|src/payload\.config\.ts|src/app/\(payload\)/|src/lib/(cache|env|payload)\.ts|\.github/|\.claude/|pnpm-lock\.yaml|biome\.json|components\.json|tsconfig\.json|scripts/)|(^|/)package\.json$|(^|/)next\.config\.|(^|/)\.env'
# Content model: never auto-merged, but the designer can validate it on the preview.
MODEL='^(src/collections/|src/globals/|src/fields/|src/payload-types\.ts)'

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
elif [[ -n $model ]]; then echo "designer: content model: $(tr '\n' ' ' <<<"$model")"
elif ((lines > MAX_LINES)); then echo "designer: $lines changed lines (auto-merge max $MAX_LINES)"
elif ((files > MAX_FILES)); then echo "designer: $files files (auto-merge max $MAX_FILES)"
else echo eligible
fi
