#!/usr/bin/env bash
# Kopiert die Einkaufsseiten direkt in den Branch gh-pages, ohne die ganze Next.js-Seite neu zu bauen.
set -euo pipefail
cd "$(dirname "$0")/../.."
tmp="$(mktemp -d)"
git fetch -q origin +gh-pages:refs/remotes/origin/gh-pages
git worktree add -q "$tmp" origin/gh-pages
cp public/einkauf-eu.html public/zubehoer-eu.html public/merkliste.html "$tmp/"
cd "$tmp"
git add einkauf-eu.html zubehoer-eu.html merkliste.html
if git diff --cached --quiet; then echo "Keine Änderung an den Seiten."; else
  git -c user.name="${GIT_AUTHOR_NAME:-Claude}" -c user.email="${GIT_AUTHOR_EMAIL:-noreply@anthropic.com}" commit -q -m "Angebote aktualisiert"
  git push -q origin HEAD:gh-pages
  echo "Veröffentlicht: https://pahlborn.github.io/huepfburg-verleih/einkauf-eu.html"
fi
cd - >/dev/null; git worktree remove --force "$tmp"
