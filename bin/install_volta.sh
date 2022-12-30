#!/bin/bash

source_volta() {
    export VOLTA_HOME=$VOLTA_HOME
    export PATH=$VOLTA_HOME/bin:$PATH
}

check_curl() {
    # Exit if curl is not installed
    [[ ! -x "$(command -v curl)" ]] && {
        echo "Please install curl."
        exit 1
    } || return 0
}

check_volta() {
    source_volta
    [[ -x "$(command -v volta)" ]] && return 0 || return 1
}

install_volta() {
    check_curl

    # Create the volta directory if $VOLTA_HOME is set
    [[ -n "$VOLTA_HOME" ]] && mkdir -p $VOLTA_HOME

    mkdir -p $VOLTA_HOME
    curl https://get.volta.sh | bash

    source_volta

    export VOLTA_HOME=$VOLTA_HOME
    export PATH=$VOLTA_HOME/bin:$PATH

    volta install node
    volta install npm

}

main() {
    check_volta || install_volta
}

[[ "${#BASH_SOURCE[@]}" -eq 1 ]] && main "$@"
