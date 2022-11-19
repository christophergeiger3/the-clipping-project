FROM node:lts-alpine

ARG PORT=4191
ARG VITE_APP_API_URL=http://localhost:4190

ENV PORT $PORT
ENV VITE_APP_API_URL $VITE_APP_API_URL

WORKDIR /web

# ignores node_modules and build files (.dockerignore)
COPY . /web/

RUN npm install
RUN npm run build
RUN npm install -g serve

EXPOSE ${PORT}

# start app
CMD serve -s dist -l ${PORT}