#!/usr/bin/env bash

# fetch latest nodejs archive
wget https://nodejs.org/dist/v8.8.1/node-v8.8.1-linux-x64.tar.gz -O /tmp/nodejs.tgz

# unzip
tar -xzf /tmp/nodejs.tgz

# add nodejs binaries to path
export PATH=$PATH:$TRAVIS_BUILD_DIR/node-v8.8.1-linux-x64/bin