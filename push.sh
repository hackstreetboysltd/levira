#!/bin/bash
set -e

# Usage: ./push.sh "your commit message"

if [ -z "$1" ]; then
  echo "Error: Please provide a commit message."
  echo "Usage: ./push.sh \"your commit message\""
  exit 1
fi

cd "$(dirname "$0")"

LIVE_URL="${APP_URL:-https://levira.vercel.app}"

# Hobby + private repo: only the Vercel team owner's GitHub user may deploy.
# Same owner as internal-app (GitHub login hackstreetboysltd).
OWNER_EMAIL="kakaiteclimited@gmail.com"
export GIT_AUTHOR_EMAIL="$OWNER_EMAIL"
export GIT_COMMITTER_EMAIL="$OWNER_EMAIL"

echo ">> Adding files..."
git add .

if git diff --cached --quiet; then
  echo ">> No file changes to commit."
else
  echo ">> Committing as ${OWNER_EMAIL}..."
  git commit -m "$1"
fi

echo ">> Pushing to origin main..."
git push origin main

echo ">> Vercel will auto-deploy from main (usually ~1–2 min)."
echo ">> Done. Live: ${LIVE_URL}"
