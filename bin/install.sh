#!/bin/bash

## TODO: write a script that
## 1. prompts the user about the target directory
## 2. downloads the latest release tarball
## 3. untars the tarball to the target directory
## 4. removes the tarball
## 5. checks if docker is installed
## 6. if docker is not installed, prompts the user to install it
## 7. runs docker related commands

# Source the shell profile to insert the Volta shims into the PATH
. /etc/profile

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

navigate_to_api

npm install -g @nestjs/cli
npm install
npm run build


# navigate_to_web
