
#!/bin/bash
set -e

echo Publish: Checking for changes...

PACKAGE_NAME=`cat package.json | jq -r .name`
PUBLISHED_VERSION=`npm view ${PACKAGE_NAME} version`

npm version --no-git-tag-version $PUBLISHED_VERSION

PUBLISHED_SHA=`npm view ${PACKAGE_NAME} --json | jq .dist.shasum`
NEW_SHA=`npm publish --dry-run --json | jq .shasum`

if [ "$PUBLISHED_SHA" != "$NEW_SHA" ]; then 
    npm version patch --no-git-tag-version
    NEW_VERSION=`cat package.json | jq .name | tr -d '"'`

    echo Publish: Publishing ${NEW_VERSION}

    echo registry=http://registry.npmjs.org > .npmrc
    echo //registry.npmjs.org/:_authToken=${NPM_TOKEN} >> .npmrc

    npm publish
else
    echo Publish: No changes detected
fi