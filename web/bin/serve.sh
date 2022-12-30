#!/bin/bash

# install serve if it is not installed
# pass the port to serve on (default 4191) as the first argument

WEB_BIN=$(dirname "$0")
WEB_DIR="$WEB_BIN/.."
APP_DIR="$WEB_DIR/.."
APP_BIN="$APP_DIR/bin"

check_serve() {
    [[ -x "$(command -v serve)" ]] && return 0 || return 1
}

install_serve() {
    echo "Installing serve..."

    export VOLTA_HOME=$VOLTA_HOME
    export PATH=$VOLTA_HOME/bin:$PATH

    volta install serve

    echo testing serve
    serve --help
}

main() {
    check_serve || install_serve
}

[[ "${#BASH_SOURCE[@]}" -eq 1 ]] && main "$@"
