# Web Proxy 

[![Build Status](https://travis-ci.org/miton18/web-proxy.svg?branch=master)][travis] 
[![Docker Pulls](https://img.shields.io/docker/pulls/miton18/web-proxy.svg)]()
[![Github All Releases](https://img.shields.io/github/downloads/miton18/web-proxy/total.svg)]()
[![GitHub release](https://img.shields.io/github/release/miton18/web-proxy.svg)]()
[![GitHub issues](https://img.shields.io/github/issues/miton18/web-proxy.svg)]()
[![license](https://img.shields.io/github/license/miton18/web-proxy.svg)]()
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/d9eec3be9aec4494accc86ff6bd4ca04)](https://www.codacy.com/app/miton18/web-proxy?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=miton18/web-proxy&amp;utm_campaign=Badge_Grade)

[DockerHub:Web-proxy][dockerhub] 

[![JWT badge](https://jwt.io/assets/badge-compatible.svg)]()

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/5e0c0b7ae29d39294473#?env%5Bproxy-web-dev%5D=W3sia2V5IjoiaG9zdCIsInZhbHVlIjoiaHR0cDovLzEyNy4wLjAuMTo4MDgwIiwidHlwZSI6InRleHQiLCJlbmFibGVkIjp0cnVlfSx7ImtleSI6InJvdXRlSUQiLCJ0eXBlIjoidGV4dCIsInZhbHVlIjoiNTgzYjMyNTdkMWIzMGUyYjgwN2Y0OTcwIiwiZW5hYmxlZCI6dHJ1ZX0seyJrZXkiOiJ0b2tlbiIsInR5cGUiOiJ0ZXh0IiwidmFsdWUiOiJleUowZVhBaU9pSktWMVFpTENKaGJHY2lPaUpJVXpJMU5pSjkuZXlKZmFXUWlPaUkxT0RKa09HSTJPV1poWVdVM1pURXhOVFJsTm1GaU16VWlMQ0oxYzJWeWJtRnRaU0k2SWpSa2JURnVJaXdpWVhWMGFHOXlhWE5oZEdsdmJuTWlPbHRkTENKbGVIQnBjbUYwYVc5dUlqb3hORGd3TWpjNE1URXpPRFUwTENKamNtVmhkR2x2YmlJNk1UUTRNREkzTkRVeE16ZzFOSDAuZWVwbnJpcW5McmdaWWwtWEJHbGR2Z3l1WFV6aVFFTmxiS2NOWXJMYUZvQSIsImVuYWJsZWQiOnRydWV9LHsia2V5IjoiaG9zdFByb3h5IiwidmFsdWUiOiJodHRwOi8vMTI3LjAuMC4xOjgwIiwidHlwZSI6InRleHQiLCJlbmFibGVkIjp0cnVlfV0=)


## Prerequisite
> The project is build over a node.js back-end so you need it.

* Node.js >=6.9.1 && <7.0.0
* MongoDB >=3.2.11

## Installation

### Environment variables

|Variable name|Default value|Variable utility|required|
|-------------|----------------|-------------|--------|
|PROXY_TRACE_KEY|null|Set the environment variable to use [@risingstack/trace](https://npmjs.com/package/@risingstack/trace)||
|PROXY_WINSTON_OVH_CREDENTIAL|null|Set the environment variable to export your data with [winston-ovh](https://npmjs.com/package/winston-ovh)||
|PROXY_MONGODB_ADDON_USER|MONGODB_ADDON_USER|user to authenticate to mongdb||
|PROXY_MONGODB_ADDON_PASSWORD|MONGODB_ADDON_PASSWORD|password to authenticate to mongdb||
|PROXY_MONGODB_ADDON_HOST|MONGODB_ADDON_HOST|host of mongodb||
|PROXY_MONGODB_ADDON_PORT|MONGODB_ADDON_PORT|port of mongodb||
|PROXY_MONGODB_ADDON_DB|MONGODB_ADDON_DB|database to use in mongodb||
|PROXY_MONGODB_ADDON_URI|MONGODB_ADDON_URI|uri of mongodb if not present other variables is used to recreate it||
|MONGODB_ADDON_URI|null|uri compatibility to [clever-cloud](https://clever-cloud.io)||
|PROXY_API_PORT|8080|proxy api port||
|PROXY_JWT_SECRET|null|jwt secret|[x]|
|PROXY_JWT_ISSUER|null|jwt issuer||
|PROXY_JWT_AUDIENCE|null|jwt audience||
|PROXY_PEPPER|null|Pepper of the application, encrypt password|[x]|
|PROXY_WARP10_URI|null|URI to warp10||
|PROXY_WARP10_WRITE_TOKEN|null|Write token to warp10||
|PROXY_DOCKER_SOCKET|null|Give to proxy to manage container||

## Usage

### Docker

```bash
# docker run --rm -p 80:80 -p 443:443 -p 8080:8080 -e <ENV_VARIABLE>=<ENV_VARIABLE_VALUE> --name web-proxy miton18/web-proxy:latest
```

### Docker-compose

> /!\ Please edit the docker-compose.yml with ours vars before start it

```bash
$ docker-compose up -d
```

## API Authentication

### JWT - [JSON Web Token](https://jwt.io)

To authenticate, you must use a JSON Web Token, to get one, you must exists as an user on the platform and request the route

> GET /api/token

This route need a basic authentication with your username and password passed as a form.

example:

```javascript
fetch('http://127.0.0.1:8080/api/route', {
  method: 'POST',
  headers: {
    'content-type': 'application/json'
  },

  body: JSON.stringify({
    host: '<host>',
    port: 8090,
    ssl: false,
    active: true
  })
})

  .then(function(result) {
    return result.json();
  })

  .then(function(json) {
    // json is that form: {token: String}

    resolve();
  })

  .catch(function(error) {
    // handle error
  });
```

## References

[dockerhub]: <https://hub.docker.com/r/miton18/web-proxy/>
[travis]: <https://travis-ci.org/miton18/web-proxy>
[laas]: <https://www.ovh.com/fr/data-platforms/logs/>
[trace]: <https://trace.risingstack.com>
[JWT]: <https://jwt.io>
