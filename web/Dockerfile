FROM node:lts-alpine

ARG PORT
ARG REACT_APP_API_URL
ARG REACT_APP_WEB_URL

ENV PORT $PORT
ENV REACT_APP_API_URL $REACT_APP_API_URL
ENV REACT_APP_WEB_URL $REACT_APP_WEB_URL

WORKDIR /web

# ignores node_modules and build files (.dockerignore)
COPY . /web/

RUN yarn
RUN yarn build
RUN yarn global add serve

EXPOSE ${PORT}

# start app
CMD serve -s build -l ${PORT}
