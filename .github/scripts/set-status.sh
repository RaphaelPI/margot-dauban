#!/usr/bin/env bash
# Usage: set-status.sh <issue-number> <status>   e.g. set-status.sh 42 agent-ready
# Sets status:<status> and removes every other status:* label (statuses are exclusive).
set -euo pipefail
issue=$1
new="status:$2"
old=$(gh issue view "$issue" --json labels \
  --jq "[.labels[].name | select(startswith(\"status:\") and . != \"$new\")] | join(\",\")")
gh issue edit "$issue" --add-label "$new" ${old:+--remove-label "$old"}
