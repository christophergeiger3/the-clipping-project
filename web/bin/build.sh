#!/bin/bash

SCRIPT_DIR=$(dirname "$0")
WEB_DIR="$SCRIPT_DIR/.."
WEB_BIN="$WEB_DIR/bin"
APP_BIN="$WEB_DIR/../bin"

install_npm_dependencies() {
    cd $WEB_DIR
    # npm install alternative
    npm ci && npm cache clean --force
}

install_web_dependencies() {
    install_npm_dependencies
}

build_web() {
    cd $WEB_DIR
    npm run build
}

main() {
    install_web_dependencies
    build_web
}

[[ "${#BASH_SOURCE[@]}" -eq 1 ]] && main "$@"
