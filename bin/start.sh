#!/bin/bash

SCRIPT_DIR=$(dirname "$0")
APP_DIR="$SCRIPT_DIR/.."
APP_BIN="$APP_DIR/bin"
WEB_DIR="$APP_DIR/web"
API_DIR="$APP_DIR/api"

start_web() {
    cd $WEB_DIR
    serve -s dist -l 4191
}

start_api() {
    cd $API_DIR
    npm run start:prod
}

main() {
    start_web &

    # Send logs to /dev/null to avoid cluttering the terminal
    mongod &>/dev/null &

    start_api
}

[[ "${#BASH_SOURCE[@]}" -eq 1 ]] && main "$@"
