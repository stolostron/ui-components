#!/usr/bin/env bash

# Copyright Contributors to the Open Cluster Management project

set -e # Exit immediately if a command returns a non-zero status.

if [ $# -eq 0 ]; then
    echo "No arguments supplied";
    exit 1
fi

if [ "$GITHUB_TOKEN" = "" ]; then
    echo "GITHUB_TOKEN required"
    exit 1
fi

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
cd $DIR/..

echo ===============================================================================

git config --global user.email "travis@travis-ci.org"
git config --global user.name "Travis CI"

if [[ $1 == feat* ]] || [[ $1 == minor* ]]; then
    echo "Creating Minor Release"
    npm version minor
    VERSION=`cat package.json | jq -r .version`
    git push origin $VERSION

    V=(${VERSION//./ })
    echo " - Creating Minor Branch v${V[0]}.${V[1]}.x"
    git branch v${V[0]}.${V[1]}.x
    git push origin v${V[0]}.${V[1]}.x
else
    echo "Creating Patch Release"
    npm version patch
    VERSION=`cat package.json | jq -r .version`
    git push origin $VERSION
fi

echo