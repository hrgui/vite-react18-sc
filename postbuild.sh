#!/bin/sh
set -xe

rm -rf build
mkdir build

cp ./dist/client/index.html ./build/index.html

mkdir ./build/server
cp -R ./dist/server/* ./build/server

mkdir ./build/client
mkdir ./build/client/assets
cp -R ./dist/client/assets/* ./build/client/assets

cp ./production/prod-server.mjs ./build/server/prod-server.mjs
