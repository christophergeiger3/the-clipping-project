<p align="center">
  <img src="https://openclipart.org/image/800px/249421" width="120" alt="TCP Logo" />
</p>
<p align="center">An easy to use self-hosted clipping tool; TCP generates and hosts shareable video clips. </p>

## ⚙️ Installation
### 🐋 Docker
Make sure [Docker is installed](https://docs.docker.com/get-docker/) and the Docker service is running.
```bash
docker compose up
```
### 🏠 Local
Make sure youtube-dl, ffmpeg, and mongodb are installed. Start the mongodb service:
```bash
sudo systemctl start mongodb.service
```
Launch the app API:
```bash
cd api
npm install
npm run start
```
Open a new terminal and launch the web front-end:
```bash
cd web
yarn
yarn start
```
