FROM node:7.2.0

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ENV NODE_ENV $NODE_ENV
COPY package.json /usr/src/app/
COPY yarn.lock /usr/src/app/

RUN npm install
COPY . /usr/src/app

EXPOSE 80 443 8080

ENTRYPOINT [ "npm", "start" ]
