#!/usr/bin/env bash
# Called by agent-preview.yml with REPO, SHA, URL. Creates or updates the PR's single
# "Aperçu" comment for the PR whose head is SHA, and announces the first preview on the issue.
set -euo pipefail
pr=$(gh api "repos/$REPO/commits/$SHA/pulls" \
  --jq '[.[] | select(.state == "open" and .base.ref == "main")][0].number // empty')
[[ -n $pr ]] || { echo "No open PR into main for $SHA"; exit 0; }
head=$(gh pr view "$pr" --json headRefOid --jq .headRefOid)
[[ $head == "$SHA" ]] || { echo "Stale deployment ($SHA), PR head is $head"; exit 0; }

body=$(cat <<MD
<!-- agent:preview sha=$SHA -->
### 👀 Aperçu de cette version

**$URL**

Vérifie le rendu sur ordinateur et sur mobile. Si c'est bon pour toi :

- [ ] Valider et fusionner

<sub>Version \`${SHA:0:7}\`. Toute nouvelle modification annule la validation et met à jour ce lien.</sub>
MD
)
existing=$(gh api "repos/$REPO/issues/$pr/comments" --paginate \
  --jq '.[] | select(.body | startswith("<!-- agent:preview")) | .id' | tail -1)
if [[ -n $existing ]]; then
  gh api -X PATCH "repos/$REPO/issues/comments/$existing" -f body="$body" >/dev/null
else
  gh pr comment "$pr" --body "$body"
  issue=$(gh pr view "$pr" --json body --jq .body | grep -oiE '(closes|fixes|resolves) #[0-9]+' | head -1 | grep -oE '[0-9]+' || true)
  [[ -z $issue ]] || gh issue comment "$issue" --body "👀 Aperçu prêt : $URL — à valider dans la PR #$pr."
fi
