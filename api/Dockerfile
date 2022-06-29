FROM node:lts-alpine

ARG PORT
ARG DATABASE_URL
ARG TEST_DATABASE_URL
ARG API_URL
ARG NODE_ENV

ENV PORT $PORT
ENV DATABASE_URL $DATABASE_URL
ENV TEST_DATABASE_URL $TEST_DATABASE_URL
ENV API_URL $API_URL
ENV NODE_ENV $NODE_ENV

RUN apk add --no-cache ffmpeg python3

# Install yt-dlp
RUN wget https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -O /usr/local/bin/yt-dlp
RUN chmod a+rx /usr/local/bin/yt-dlp

WORKDIR /api
COPY . /api/

RUN npm install -g @nestjs/cli
RUN npm install
RUN npm run build

EXPOSE ${PORT}

# start app
CMD ["npm", "run", "start:prod"]
