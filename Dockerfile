FROM node:lts-alpine as web

ARG PORT=4191
ARG VITE_APP_API_URL=http://localhost:4190

ENV PORT $PORT
ENV VITE_APP_API_URL $VITE_APP_API_URL

WORKDIR /web

COPY ./web /web

RUN npm install
RUN npm run build

# EXPOSE ${PORT}
# # start app
# CMD serve -s dist -l ${PORT}

### ~~~
FROM mongo:latest as api

COPY --from=web /web/dist /web/dist

ARG PORT=4190
ARG DATABASE_URL=mongodb://mongo/the-clipping-project
ARG TEST_DATABASE_URL=mongodb://mongo/the-clipping-project-test
ARG API_URL=http://localhost:4190
ARG NODE_ENV=production

ENV PORT $PORT
ENV DATABASE_URL $DATABASE_URL
ENV TEST_DATABASE_URL $TEST_DATABASE_URL
ENV API_URL $API_URL
ENV NODE_ENV $NODE_ENV

# RUN apk add --no-cache ffmpeg python3
RUN apt-get update && apt-get install -y ffmpeg python3 curl wget npm
# RUN apt-get install ffmpeg python3 curl
RUN curl https://get.volta.sh | bash
# TODO apk add mongodb

# Install yt-dlp
RUN wget https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -O /usr/local/bin/yt-dlp
RUN chmod a+rx /usr/local/bin/yt-dlp

# Install mongodb
EXPOSE 27017
# RUN apk add openrc
# RUN echo 'http://dl-cdn.alpinelinux.org/alpine/v3.6/main' >> /etc/apk/repositories
# RUN echo 'http://dl-cdn.alpinelinux.org/alpine/v3.6/community' >> /etc/apk/repositories
# RUN apk update
# RUN apk add mongodb mongodb-tools
# RUN rc-update add mongodb default
# RUN rc-service mongodb start || :
# RUN mkdir -p /data/db
# RUN mongod --dpath=/data &

WORKDIR /api
COPY ./api /api/


RUN npm install -g @nestjs/cli
RUN npm install
RUN npm run build

WORKDIR /web
RUN npm install -g serve
EXPOSE 4190 4191

WORKDIR /
COPY ./bin /bin
CMD ["start.sh"]

# start app
# CMD ["npm", "run", "start:prod"]
