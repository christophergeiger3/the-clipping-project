<p align="center">
  <img src="https://openclipart.org/image/800px/249421" width="120" alt="TCP Logo" />
</p>
<p align="center">An easy to use self-hosted clipping tool.</p>
<p align="center">Clip videos from popular websites like YouTube, then share with friends!</p>

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
[Install mongodb](https://www.mongodb.com/docs/manual/administration/install-community/), then start the mongod service:
```bash
sudo systemctl start mongod.service
```

Compile yt-dlp from source:
```bash
sudo apt-get install -y python3-pytest python3 make git zip ffmpeg pandoc
git clone https://github.com/yt-dlp/yt-dlp
cd yt-dlp
make
sudo cp yt-dlp /usr/local/bin/yt-dlp
sudo chmod a+rx /usr/local/bin/yt-dlp
```

Install npm and nodejs:
```bash
sudo apt-get install -y npm nodejs
```

Install yarn:
```bash
sudo npm install --global yarn
```

Install the nestjs CLI:
```
npm install -g @nestjs/cli
```
#### Running a production build
Build the app api:
```bash
cd api
npm install
cp .env.example .env
npm run build
```
Launch the app api:
```bash
npm run start:prod
```

Open a new terminal and build the web front-end:
```bash
cd web
yarn
cp .env.example .env
yarn build
yarn global add serve
```

Launch the web front-end:
```
PORT=4191; serve -s build -l ${PORT}
```
#### Running a development build
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

## 🌲 Environment
TCP ships with a `.env.example` file which gives an example of some configuration options you can tweak, such as the port the API that TCP's API will run on (`API_PORT`) and the port that TCP's web client will run on (`WEB_PORT`).

To configure TCP, copy the example env file to `.env` in the same directory:
```bash
cp .env.example .env
```
then edit the `.env` file as you see fit.

If you're running docker, you may need to rebuild your docker images once you've made changes:
```bash
docker compose build
```

## 🛠️ API
To access the docs for TCP's API, navigate to the `/api` route of your API's URL (default: http://localhost:4190/api).

TCP's API is self-documented by Swagger/OpenAPI through NestJS, and comes with a built-in tool for building HTTP queries quickly and easily.

## 🐛 Bugs, feedback, contributions
Leave no question unasked! Feel free to drop any feedback or thoughts under the [issues tab](https://github.com/christophergeiger3/the-clipping-project/issues).
