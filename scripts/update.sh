# Copyright Contributors to the Open Cluster Management project

#!/bin/bash
set -x
set -e

if [ "$GITHUB_TOKEN" = "" ]; then
    echo "GITHUB_TOKEN required"
    exit 1
fi

PACKAGE_NAME=`cat package.json | jq -r .name | cut -c 2-`

git remote remove origin
git remote add origin https://${GITHUB_TOKEN}@github.com/${PACKAGE_NAME}.git > /dev/null 2>&1
git checkout main

rm -rf node_modules
rm -f package-lock.json

npx npm-check-updates --doctor -u
npm dedup
npm audit fix

if git diff --name-only | grep 'package.json\|package-lock.json'; then
    npm run lint:fix
    npm run check:fix
    npm run build
    npm run build:storybook
    npm test
    npm run lint
    npm run check
    git config --global user.email "travis@travis-ci.org"
    git config --global user.name "Travis CI"
    git add -u :/
    git commit -m "fix(deps): upgrade dependencies"
    git push origin main
else
    echo No upgrades available
fi