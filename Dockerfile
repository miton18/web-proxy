FROM node:7

MAINTAINER miton18 <contact@rcdinfo.fr>

RUN mkdir -p /usr/src/web-proxy
WORKDIR /usr/src/web-proxy

ENV NODE_ENV $NODE_ENV

RUN curl -o- -L https://yarnpkg.com/install.sh | bash && \
    export PATH=$HOME/.yarn/bin:$PATH

# Install deps
COPY package.json /usr/src/web-proxy/
COPY yarn.lock /usr/src/web-proxy/
RUN yarn install --prod

# Copy app
COPY . /usr/src/web-proxy

EXPOSE 80 443 8080

ENTRYPOINT yarn start
