FROM node:lts-alpine

# Install youtube-dl and ffmpeg
RUN apk add --no-cache youtube-dl
RUN apk add --no-cache ffmpeg

WORKDIR /api

COPY package*.json /api/

RUN npm install

COPY . /api/

EXPOSE 4190

# start app
CMD ["npm", "run", "start:debug"]

