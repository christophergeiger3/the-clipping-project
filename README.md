<p align="center">
  <img src="https://openclipart.org/image/800px/249421" width="120" alt="TCP Logo" />
</p>
<p align="center">An easy to use self-hosted clipping tool; TCP generates and hosts shareable video clips. </p>
<p align="center">TCP works great with sites like YouTube, Dailymotion, and many others. </p>

## 📽️ Demo

## ⚙️ Installation
The Clipping Project may be installed either via Docker or by running each service independently (local).
### 🐋 Docker
Make sure [Docker is installed](https://docs.docker.com/get-docker/) and the Docker service is running.
```bash
docker compose build
docker compose up
```
### 🏠 Local
Make sure youtube-dl, ffmpeg, npm, yarn and mongodb are installed. Start the mongodb service:
```bash
sudo systemctl start mongodb.service
```
Launch the app API:
```bash
cd api
npm install
npm start
```
Open a new terminal and launch the web front-end:
```bash
cd web
yarn
yarn start
```
## 🛠️ API
To access the docs for TCP's API, navigate to the `/api` route of your API's URL (default: http://localhost:3000/api).

TCP's API is self-documented by Swagger/OpenAPI through NestJS, and comes with a built-in tool for building HTTP queries quickly and easily.

## 🐛 Bugs, feedback, contributions
Leave no question unasked! Feel free to drop any feedback or thoughts under the [issues tab](https://github.com/christophergeiger3/the-clipping-project/issues).
