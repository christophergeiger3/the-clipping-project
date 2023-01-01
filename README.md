<p align="center">
  <img src="https://openclipart.org/image/800px/249421" width="120" alt="TCP Logo" />
</p>
<p align="center">An easy to use self-hosted clipping tool.</p>
<p align="center">Clip videos from popular websites like YouTube, then share with friends!</p>

## 🤔 Why would I use this software?
- Download videos from [a very broad range](https://github.com/yt-dlp/yt-dlp/blob/master/supportedsites.md) of sources to your own personal website.
- Sharing a URL from The Clipping Project bypasses upload size limits on sites like Discord.
- Self-hosted -- no one else can remove or delete the videos you clip.
- No frills -- share only the portion of the video you choose without any additional UI. No need to link your friends to someone else's website.
- Authentication -- clipping utilities are available to just you, but clips you save can be shared with anyone who has a link.
- Various tools for creating and previewing video clips

## 📽️ Demo

https://user-images.githubusercontent.com/20095580/210183833-eaed72d3-00d8-4d25-9de9-b879dabb6308.mp4

https://user-images.githubusercontent.com/20095580/210183839-a976afc7-8ce4-44a5-a522-c5d6304937aa.mp4

https://user-images.githubusercontent.com/20095580/210183491-346219da-4744-451d-92c5-b22e693cdf5c.mp4

## ⚙️ Installation
The Clipping Project may be installed either via Docker or by running each service independently (local).

### 🐋 Docker
Make sure [Docker is installed](https://docs.docker.com/get-docker/) and the Docker service is running.

```bash
docker run -t -i -p 4190:4190 -p 4191:4191 -v ~/Videos:/app/api/videos christophergeiger3/the-clipping-project:latest
```
Then navigate to http://localhost:4191. The `-v ~/Videos:/app/api/videos` saves clips to the `~/Videos` directory on your PC -- you can change `~/Videos` to whatever folder you'd like. By default the owner username is `admin` and the owner password is `admin` (this can be changed). Environment variables may also be passed through the `docker run` command, e.g.
```bash
docker run -t -i -e OWNER_PASSWORD='hunter2' -p 4190:4190 -p 4191:4191 christophergeiger3/the-clipping-project:latest
```

### 🏠 Local
[Install mongodb](https://www.mongodb.com/docs/manual/administration/install-community/), then start the mongod service:
```bash
sudo systemctl start mongod.service
```

Install yt-dlp:
```bash
wget https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -O /usr/local/bin/yt-dlp
chmod a+rx /usr/local/bin/yt-dlp
```

Install volta:
```bash
curl https://get.volta.sh | bash
```

Install the nestjs CLI:
```bash
npm install -g @nestjs/cli
```

#### Running a production build
Install volta:
```bash
curl https://get.volta.sh | bash
```

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
npm run start:debug
```
Open a new terminal and launch the web front-end:
```bash
cd web
yarn
yarn start
```
⚠️ The web front-end is being rebuilt in vite -- see the `/vite` directory.

## 🌲 Environment
TCP ships with a `.env.example` file which gives an example of some configuration options you can tweak, such as the port the API that TCP's API will run on (`API_PORT`) and the port that TCP's web client will run on (`WEB_PORT`).

To configure TCP, copy the example env file to `.env` in the same directory:
```bash
cp .env.example .env
```
then edit the new `.env` file as you see fit.

If you're running docker, you may need to rebuild your docker images once you've made changes:
```bash
docker compose build
```

### Configuring a local build
If you're running a local build (no docker), then you'll work with two `.env` files, `api/.env` and `web/.env`, and can ignore the `.env` file in the root of the `the-clipping-project` directory.


## 🛠️ API
To access the docs for TCP's API, navigate to the `/api` route of your API's URL (default: http://localhost:4190/api).

TCP's API is self-documented by Swagger/OpenAPI through NestJS, and comes with a built-in tool for building HTTP queries quickly and easily.

## 💻 Technologies
TCP is built with [NestJS](https://nestjs.com/), [MUI](https://mui.com/), [Vite](https://vitejs.dev/), and [React](https://reactjs.org/).

[YT-DLP](https://github.com/yt-dlp/yt-dlp) is the special sauce TCP uses to download and save video clips.

## 🐛 Bugs, feedback, contributions
Leave no question unasked! Feel free to drop any feedback or thoughts under the [issues tab](https://github.com/christophergeiger3/the-clipping-project/issues).

## Similar Projects
If TCP isn't what you're looking for, that's okay!
Here are some other utilities which might have the functionality you want:

- [WatchVideoByLink](https://github.com/MohamedBakoush/WatchVideoByLink)
- [yt-dlp](https://github.com/yt-dlp/yt-dlp)
- [FFmpeg](https://github.com/FFmpeg/FFmpeg)
