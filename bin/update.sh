#!/usr/bin/env bash

## TODO:
## would be nice to be able to install directly from the command line
## e.g. curl this script and pipe it to bash instead of git clone
## then this script could also take care of installing other dependencies
## or giving install options to the user

PRE_RELEASE_URL="https://api.github.com/repos/christophergeiger3/the-clipping-project/releases/71234724"
# RELEASE_URL="https://api.github.com/repos/christophergeiger3/the-clipping-project/releases/latest"

navigate_to_script_directory() {
    cd "$(dirname "$0")"
}

navigate_to_root() {
    navigate_to_script_directory
    cd ..
}

get_latest_release_tarball_url() {
    # For now we're using the pre-release tarball since the latest release hasn't come out yet
    tarball_url=$(curl -s "$PRE_RELEASE_URL" | grep tarball_url | cut -d : -f 2,3 | tr -d \" | tr -d ,)
}

download_latest_release_tarball() {
    echo "Downloading the latest release tarball..."
    get_latest_release_tarball_url
    echo $tarball_url
    wget -q $tarball_url -O latest.tar.gz
}

untar_latest_release_tarball() {
    echo "Untarring the latest release tarball..."
    # Untars to the current directory
    tar -xzf latest.tar.gz --strip-components=1
}

remove_latest_release_tarball() {
    echo "Removing the latest release tarball..."
    rm latest.tar.gz
}

#navigate_to_root
download_latest_release_tarball
untar_latest_release_tarball
remove_latest_release_tarball
echo "Done."
