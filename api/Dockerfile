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

# Install yt-dlp dependencies (only needed when compiling from source)
RUN apk add --no-cache make python3 zip pytest ffmpeg git

# Install pandoc (another yt-dlp dependency)
RUN wget https://github.com/jgm/pandoc/releases/download/2.18/pandoc-2.18-linux-amd64.tar.gz
RUN tar xvzf ./pandoc-2.18-linux-amd64.tar.gz --strip-components 1 -C /usr/local/
RUN rm ./pandoc-2.18-linux-amd64.tar.gz

# For now, we will compile yt-dlp from source. Eventually we will download
# the latest release once some release has --download-sections available
WORKDIR /yt-dlp
RUN git clone https://github.com/yt-dlp/yt-dlp .
RUN make
RUN cp ./yt-dlp /usr/local/bin/yt-dlp

# TODO: Remove me!
RUN apk add --no-cache youtube-dl

WORKDIR /api

COPY . /api/

RUN npm install -g @nestjs/cli
RUN npm install
RUN npm run build

EXPOSE ${PORT}

# start app
CMD ["npm", "run", "start:prod"]
