#!/bin/bash

# TODO: this is a hack, need to figure out a better way...
curl https://get.volta.sh | bash

export VOLTA_HOME="$HOME/.volta"
export PATH="$VOLTA_HOME/bin:$PATH"

navigate_to_script_directory() {
    cd "$(dirname "$0")"
}

navigate_to_web() {
    navigate_to_script_directory
    cd ../web
}

navigate_to_api() {
    navigate_to_script_directory
    cd ../api
}

start_web() {
    navigate_to_web

    echo web node version
    node --version

    serve -s dist -l 4191
}

start_api() {
    navigate_to_api

    echo web node version
    node --version

    npm run start:prod
}

start_web &
mongod &
start_api
