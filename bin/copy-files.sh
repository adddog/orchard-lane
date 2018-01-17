#!/usr/bin/env sh

cp client/src/index.html client/dist
rm -rf client/dist/fonts
rm -rf client/dist/json
cp -R client/src/fonts client/dist/fonts
cp -R client/src/json client/dist/json
