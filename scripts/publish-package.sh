#!/usr/bin/env bash

# Copyright Contributors to the Open Cluster Management project

set -e # Exit immediately if a command returns a non-zero status.

if [ "$NPM_TOKEN" = "" ]; then
    echo "NPM_TOKEN required"
    exit 1
fi

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
cd $DIR/..

echo ===============================================================================
PACKAGE_NAME=`cat package.json | jq -r .name`
VERSION=`cat package.json | jq -r .version`
echo "Publishing NPM Package"
echo
echo "     Name: $PACKAGE_NAME"
echo "  Version: $VERSION"
echo
echo registry=http://registry.npmjs.org > .npmrc
echo //registry.npmjs.org/:_authToken=${NPM_TOKEN} >> .npmrc
npm publish
echo