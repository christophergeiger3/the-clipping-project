navigate_to_script_directory() {
    cd "$(dirname "$0")"
}

navigate_to_root() {
    navigate_to_script_directory
    cd ..
}

navigate_to_web() {
    navigate_to_script_directory
    cd ../web
}

navigate_to_api() {
    navigate_to_script_directory
    cd ../api
}

build_web() {
    navigate_to_web
    npm install
    npm run build
}

build_api() {
    navigate_to_api
    npm install
    npm run build
}

restart_services() {
    pm2 restart tcp-api
    pm2 restart tcp-web
}

download_latest_commits() {
    navigate_to_root
    git fetch
    git reset --hard origin/main
}

# In the future when npm packages are used, this script should essentially be:
# navigate_to_root
# npm install
# npm run build
# pm2 restart tcp-api
# pm2 restart tcp-web

download_latest_commits

build_api
build_web

restart_services
