#!/bin/bash

API_PORT=4190
WEB_PORT=4191
HOST_CLIP_DIR=~/Videos

echo "Thank you for using The Clipping Project!"
read -p "Please press enter to continue..."
echo

echo "Clips will be hosted on localhost:$API_PORT"
echo "The web app will be hosted on localhost:$WEB_PORT"
echo "Clip files will be saved to $HOST_CLIP_DIR"

echo
read -p "Press enter to launch the app..."
echo

docker run -t -i -p $API_PORT:$API_PORT -p $WEB_PORT:$WEB_PORT -v $HOST_CLIP_DIR:/app/api/videos christophergeiger3/the-clipping-project:latest
