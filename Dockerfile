FROM ubuntu as web

ARG PORT=4191
ARG VITE_APP_API_URL=http://localhost:4190

ENV PORT $PORT
ENV VITE_APP_API_URL $VITE_APP_API_URL

WORKDIR /app/web

COPY ./bin /app/bin
COPY ./web /app/web

RUN apt-get update && apt-get install -y curl

# VOLTA ---
SHELL [ "/bin/bash", "-c" ]
RUN touch /app/bin/bashrc
ENV PROFILE /app/bin/bashrc
ENV BASH_ENV /app/bin/bashrc
ENV VOLTA_HOME /app/bin/volta
ENV PATH $VOLTA_HOME/bin:$PATH
# ---

RUN curl https://get.volta.sh | bash

RUN /app/web/bin/build.sh

FROM mongo:latest as api

COPY --from=web /app/web/dist /app/web/dist
COPY --from=web /app/bin /app/bin
COPY --from=web /app/web/bin /app/web/bin
# Copy package.json for volta version
COPY --from=web /app/web/package.json /app/web/package.json

ARG PORT=4190
ARG DATABASE_URL=mongodb://localhost/the-clipping-project
ARG TEST_DATABASE_URL=mongodb://localhost/the-clipping-project-test
ARG API_URL=http://localhost:4190
ARG NODE_ENV=production

ENV PORT $PORT
ENV DATABASE_URL $DATABASE_URL
ENV TEST_DATABASE_URL $TEST_DATABASE_URL
ENV API_URL $API_URL
ENV NODE_ENV $NODE_ENV

# VOLTA ---
SHELL [ "/bin/bash", "-c" ]
RUN touch /app/bin/bashrc
ENV PROFILE /app/bin/bashrc
ENV BASH_ENV /app/bin/bashrc
ENV VOLTA_HOME /app/bin/volta
ENV PATH $VOLTA_HOME/bin:$PATH
# ---

RUN apt-get update && apt-get install -y ffmpeg python3 curl wget

# Install yt-dlp
RUN wget https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -O /usr/local/bin/yt-dlp && chmod a+rx /usr/local/bin/yt-dlp

EXPOSE 27017

COPY ./api /app/api/
WORKDIR /app/api
RUN /app/api/bin/build.sh

WORKDIR /app/web
RUN volta install node@14
RUN volta install serve
EXPOSE 4190 4191

WORKDIR /app
CMD ["/app/bin/start.sh"]
