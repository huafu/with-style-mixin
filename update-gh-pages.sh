#!/bin/bash
# this scripts expect that the gh-pages directory is a clone of the `gh-pages` github branch

cd $(dirname $0)
NAME=$(node -pe "require('./package.json').name")
GH_PAGES_DIR=./gh-pages
EMBER_CLI_BASE_URL="/${NAME}/" EMBER_CLI_LOCATION_TYPE="hash" ember build -prod && \
rm -rf ${GH_PAGES_DIR}/* && \
cp -R dist/* ${GH_PAGES_DIR}/
