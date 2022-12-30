#!/bin/bash

API_BIN=$(dirname "$0")
API_DIR="$API_BIN/.."
APP_BIN="$API_DIR/../bin"

install_api_dependencies() {
    cd $API_DIR

    npm install -g @nestjs/cli
    npm install
}

build_api() {
    npm run build
}

main() {
    install_api_dependencies
    build_api
}

[[ "${#BASH_SOURCE[@]}" -eq 1 ]] && main "$@"
