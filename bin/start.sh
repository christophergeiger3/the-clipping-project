#!/bin/bash

SCRIPT_DIR=$(dirname "$0")
APP_DIR="$SCRIPT_DIR/.."
APP_BIN="$APP_DIR/bin"
WEB_DIR="$APP_DIR/web"
API_DIR="$APP_DIR/api"

export VOLTA_HOME=$VOLTA_HOME
export PATH=$VOLTA_HOME/bin:$PATH

start_web() {
    echo volta:
    echo $VOLTA_HOME

    export VOLTA_HOME=$VOLTA_HOME
    export PATH=$VOLTA_HOME/bin:$PATH

    cd $WEB_DIR

    # echo npm:
    # npm --version

    # if [[ -x "$(command -v npm)" ]] || [[ -x "$(command -v serve)" ]]; then
    #     # volta install node
    #     # volta install npm
    #     # npm install -g serve
    #     # echo serve:
    #     volta install serve
    #     serve --version
    # fi

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

if [[ "${#BASH_SOURCE[@]}" -eq 1 ]]; then
    main "$@"
fi
