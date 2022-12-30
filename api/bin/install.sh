#!/bin/bash

source_volta() {
    export VOLTA_HOME="$HOME/.volta"
    export PATH="$VOLTA_HOME/bin:$PATH"
}

navigate_to_script_directory() {
    cd "$(dirname "$0")"
}

navigate_to_api_directory() {
    navigate_to_script_directory
    cd ..
}

navigate_to_api_directory

source_volta
curl https://get.volta.sh | bash
source_volta

npm install -g @nestjs/cli
npm install
npm run build
