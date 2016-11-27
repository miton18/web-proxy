# Web-Proxy

[![Build Status](https://travis-ci.org/miton18/web-proxy.svg?branch=v3)][travis]

[DockerHub:Web-proxy][dockerhub]

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/5e0c0b7ae29d39294473#?env%5Bproxy-web-dev%5D=W3sia2V5IjoiaG9zdCIsInZhbHVlIjoiaHR0cDovLzEyNy4wLjAuMTo4MDgwIiwidHlwZSI6InRleHQiLCJlbmFibGVkIjp0cnVlfSx7ImtleSI6InJvdXRlSUQiLCJ0eXBlIjoidGV4dCIsInZhbHVlIjoiNTgzYjMyNTdkMWIzMGUyYjgwN2Y0OTcwIiwiZW5hYmxlZCI6dHJ1ZX0seyJrZXkiOiJ0b2tlbiIsInR5cGUiOiJ0ZXh0IiwidmFsdWUiOiJleUowZVhBaU9pSktWMVFpTENKaGJHY2lPaUpJVXpJMU5pSjkuZXlKZmFXUWlPaUkxT0RKa09HSTJPV1poWVdVM1pURXhOVFJsTm1GaU16VWlMQ0oxYzJWeWJtRnRaU0k2SWpSa2JURnVJaXdpWVhWMGFHOXlhWE5oZEdsdmJuTWlPbHRkTENKbGVIQnBjbUYwYVc5dUlqb3hORGd3TWpjNE1URXpPRFUwTENKamNtVmhkR2x2YmlJNk1UUTRNREkzTkRVeE16ZzFOSDAuZWVwbnJpcW5McmdaWWwtWEJHbGR2Z3l1WFV6aVFFTmxiS2NOWXJMYUZvQSIsImVuYWJsZWQiOnRydWV9LHsia2V5IjoiaG9zdFByb3h5IiwidmFsdWUiOiJodHRwOi8vMTI3LjAuMC4xOjgwIiwidHlwZSI6InRleHQiLCJlbmFibGVkIjp0cnVlfV0=)

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
