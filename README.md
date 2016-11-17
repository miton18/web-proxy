# Web-Proxy

[![Build Status](https://travis-ci.org/miton18/web-proxy.svg?branch=v3)][travis]

[hub.docker.com][dockerhub]

## Configuration

### Environement variables to provide

|Variable|Explanation|
|---|---|
|NODE_ENV         | *production* or *development*
|PROXY_DB         | *mongodb://USER:PASSWORD@HOST:PORT/DATABASE* Database access
|PROXY_OVH_KEY    | [Laas][laas] key from OVH provider
|PROXY_TRACE_KEY  | [Trace][trace] API key for monitoring
|PROXY_KEY        | used by bcrypt to cipher passwords
|PROXY_SALT       | also used to enforce passwords strength

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
