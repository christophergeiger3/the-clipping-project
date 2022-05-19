FROM node:lts-alpine

WORKDIR /web

COPY package.json /web/
COPY yarn.lock /web/

RUN yarn

COPY . /web/

EXPOSE 3001

# start app
CMD ["yarn", "start"]
