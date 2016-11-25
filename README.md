# Web-Proxy

[![Build Status](https://travis-ci.org/miton18/web-proxy.svg?branch=v3)][travis]

[DockerHub:Web-proxy][dockerhub]

## Configuration

### Environement variables to provide

|Variable name | required | Value | Explanation |
|---|---|---|---|
|NODE_ENV           |[ ]| 'production' | *production* or *development* |
|PROXY_DB           |[x]| *mongodb://USER:PASSWORD@HOST:PORT/DATABASE* | MongoDB URI |
|PROXY_OVH_KEY      |[ ]| null | Set the environment variable to export your data with [winston-ovh][laas] |
|PROXY_TRACE_KEY    |[ ]| null | Set the environment variable to use [@risingstack/trace][trace] |
|PROXY_API_PORT     |[ ]| 8080 | Proxy api port| 
|PROXY_JWT_SECRET   |[x]| null | Jwt secret| 
|PROXY_SALT         |[x]| null | Also used to enforce passwords strength |
|PROXY_JWT_ISSUER   |[ ]| null | Jwt issuer|
|PROXY_JWT_AUDIENCE |[ ]| null | Jwt audience| 

### Dependancies
 * Nodejs >= 6.0.0
 * npm >= 3.8.6
 * mongoDB
 * A redirection from your domain name provider for all proxy managed domains to your host

## Starting

``` sh 
  $ npm start
```
You can go to http://YourDmain.tld:8080

Your default user : **4dm1n**

Your default password : **pr0xy-p455w0rd** 
_You must change it !_

## Use a container
  ```
  $ docker run -d \
    -e PROXY_DB=xxx \
    -e PROXY_KEY=xxx \
    -e PROXY_SALT=xxx \
    --name web-proxy \
    --net=host \
    miton18/web-proxy
  ```
## Use containers

/!\ Please edit the docker-compose.yml with ours vars before start it
```
  $ docker-compose up -d
```

## Develop with us 

Test your app

```
  $ npm install -g newman
  $ npm test
```

[dockerhub]: <https://hub.docker.com/r/miton18/web-proxy/>
[travis]: <https://travis-ci.org/miton18/web-proxy>
[laas]: <https://www.ovh.com/fr/data-platforms/logs/>
[trace]: <https://trace.risingstack.com>
