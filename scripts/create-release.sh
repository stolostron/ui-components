#!/usr/bin/env bash

# Copyright Contributors to the Open Cluster Management project

set -e # Exit immediately if a command returns a non-zero status.

if [ $# -eq 0 ]; then
    echo "No arguments supplied";
    exit 1
fi

VERSION_TYPE=$1
COMMIT_MESSAGE=$2

if [ "$GITHUB_TOKEN" = "" ]; then
    echo "GITHUB_TOKEN required"
    exit 1
fi

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
cd $DIR/..

echo ===============================================================================

git config --global user.email "travis@travis-ci.org"
git config --global user.name "Travis CI"

PACKAGE_NAME=`cat package.json | jq -r .name | cut -c 2-`

git remote remove origin
git remote add origin https://${GITHUB_TOKEN}@github.com/${PACKAGE_NAME}.git > /dev/null 2>&1

echo "Creating $VERSION_TYPE Release"
npm version $VERSION_TYPE --no-git-tag-version

git add -u :/
git commit -m "$COMMIT_MESSAGE [ci skip]"
VERSION=`cat package.json | jq -r .version`
git tag -a $VERSION -m "$COMMIT_MESSAGE [ci skip]"
git push origin $VERSION

echo
