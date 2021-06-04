#!/usr/bin/env bash

# Copyright Contributors to the Open Cluster Management project

set -x
set -e # Exit immediately if a command returns a non-zero status.

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

npx npm-check-updates --doctor --upgrade --filter ts-loader --target minor
npx npm-check-updates --doctor --upgrade --reject ts-loader,typescript
npm dedup
npm audit fix

if git diff --name-only | grep 'package.json\|package-lock.json'; then
    git config --global user.email "travis@travis-ci.org"
    git config --global user.name "Travis CI"
    git add -u :/
    git commit -m "fix(deps): upgrade dependencies"
    git push origin main
else
    echo No upgrades available
fi
