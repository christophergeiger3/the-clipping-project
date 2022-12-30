#!/bin/bash

API_BIN=$(dirname "$0")
API_DIR="$API_BIN/.."
APP_BIN="$API_DIR/../bin"

source $APP_BIN/install_volta.sh

install_npm_dependencies() {
    cd $API_DIR

    npm install -g @nestjs/cli
    npm install
}

install_api_dependencies() {
    check_volta || install_volta
    source_volta

    install_npm_dependencies
}

build_api() {
    npm run build
}

main() {
    install_api_dependencies
    build_api
}

[[ "${#BASH_SOURCE[@]}" -eq 1 ]] && main "$@"
