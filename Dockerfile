FROM node:7.2.1

MAINTAINER miton18 <contact@rcdinfo.fr>

RUN mkdir -p /usr/src/web-proxy
WORKDIR /usr/src/web-proxy

ENV NODE_ENV $NODE_ENV

RUN npm install -g yarn

# Install deps
COPY package.json /usr/src/web-proxy/
COPY yarn.lock /usr/src/web-proxy/
RUN yarn install

# Copy app
COPY . /usr/src/web-proxy

EXPOSE 80 443 8080

ENTRYPOINT npm start
