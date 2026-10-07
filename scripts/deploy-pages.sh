#!/usr/bin/env bash
# Baut die statische Version und veröffentlicht sie im Branch gh-pages
# (https://pahlborn.github.io/huepfburg-verleih/).
set -euo pipefail
cd "$(dirname "$0")/.."
rm -rf out
GITHUB_PAGES=1 NEXT_TELEMETRY_DISABLED=1 pnpm exec next build
touch out/.nojekyll
tmp="$(mktemp -d)"
cp -a out/. "$tmp/"
cd "$tmp"
git init -q -b gh-pages
git add -A
git -c user.name="${GIT_AUTHOR_NAME:-Claude}" -c user.email="${GIT_AUTHOR_EMAIL:-noreply@anthropic.com}" commit -q -m "Statische Vorschau aktualisiert"
git push -q -f https://github.com/pahlborn/huepfburg-verleih gh-pages
echo "Veröffentlicht: https://pahlborn.github.io/huepfburg-verleih/"
