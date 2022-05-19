FROM node:lts-alpine

# TODO: install ffmpeg and youtube-dl

WORKDIR /api

COPY package*.json /api/

RUN npm install

COPY . /api/

EXPOSE 3000

# start app
CMD ["npm", "run", "start:debug"]

