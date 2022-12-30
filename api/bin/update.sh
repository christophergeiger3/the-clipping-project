#!/usr/bin/env bash

## Grab the latest tagged release from GitHub
## from: https://gist.github.com/steinwaywhw/a4cd19cda655b8249d908261a62687f8

curl -s https://api.github.com/repos/jgm/pandoc/releases/latest |
    grep "browser_download_url.*deb" |
    cut -d : -f 2,3 |
    tr -d \" |
    wget -qi -
