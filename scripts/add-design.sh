#!/usr/bin/env bash
# Usage: scripts/add-design.sh <issue-number> <slug> <file>...
#   e.g. scripts/add-design.sh 12 accueil-v4 ~/Downloads/maquette.zip ~/Desktop/mobile.png
# Stores design references (zip, html, images, pdf) in designs/<n>-<slug>/ on branch
# feat/<n>-<slug>, committed. Zips are extracted. Files are references: never executed.
# - Already on a branch for this issue (/build): commits there, push is up to the caller.
# - Otherwise (e.g. a maintainer attaching files to an existing issue): uses a temporary worktree from origin/main, commits and pushes the
#   branch, leaving the current working tree untouched.
set -euo pipefail
[[ $# -ge 3 ]] || { sed -n '2,3p' "$0"; exit 1; }
issue=$1 slug=$2; shift 2
dir="designs/$issue-$slug"
branch="feat/$issue-$slug"
max_mb=${MAX_DESIGN_MB:-25}

copy_into() { # <root>
  mkdir -p "$1/$dir"
  for f in "$@"; do
    [[ $f == "$1" ]] && continue
    [[ -f $f ]] || { echo "Not a file: $f" >&2; exit 1; }
    name=$(basename "$f")
    case $(tr '[:upper:]' '[:lower:]' <<<"${name##*.}") in
      zip)
        # Refuse absolute paths and ../ entries (zip slip).
        if unzip -Z1 "$f" | grep -qE '(^/|(^|/)\.\.(/|$))'; then echo "Unsafe paths in $name" >&2; exit 1; fi
        clean=$(LC_ALL=C sed -E 's/[^A-Za-z0-9]+/-/g; s/^-+|-+$//g' <<<"${name%.*}" | tr '[:upper:]' '[:lower:]')
        unzip -q -o "$f" -d "$1/$dir/${clean:-design}" | grep -v 'caution: excluded' || true
        rm -rf "$1/$dir/${clean:-design}/__MACOSX"
        find "$1/$dir" -name .DS_Store -delete
        ;;
      html | htm | png | jpg | jpeg | webp | gif | svg | pdf | md | txt) cp "$f" "$1/$dir/" ;;
      *) echo "Unsupported file type: $name (zip, html, png, jpg, webp, gif, svg, pdf)" >&2; exit 1 ;;
    esac
  done
  size=$(du -sm "$1/$dir" | cut -f1)
  ((size <= max_mb)) || { echo "Design files are ${size} MB (max ${max_mb} MB): compress images or send fewer files" >&2; exit 1; }
}

current=$(git branch --show-current)
if [[ $current == */"$issue"-* ]]; then
  copy_into "$(git rev-parse --show-toplevel)" "$@"
  git add "$dir" && git commit -q -m "docs(design): add design reference for #$issue"
  echo "branch=$current"
else
  git fetch -q origin main
  tmp=$(mktemp -d)
  if git ls-remote --exit-code --heads origin "$branch" >/dev/null; then
    git fetch -q origin "$branch" && git worktree add -q "$tmp" -B "$branch" "origin/$branch"
  else
    git worktree add -q "$tmp" -B "$branch" origin/main
  fi
  trap 'git worktree remove --force "$tmp"' EXIT
  copy_into "$tmp" "$@"
  git -C "$tmp" add "$dir" && git -C "$tmp" commit -q -m "docs(design): add design reference for #$issue"
  git -C "$tmp" push -q -u origin "$branch"
  echo "branch=$branch"
fi
echo "path=$dir"
find "$dir" -maxdepth 2 2>/dev/null | head -30 || true
