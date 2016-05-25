# Web-proxy

Web-proxy is nodejs based proxy to link a subdomains on a specific port

### Todo
  - support SSL
  - dynamic load of routes

## Installation

You need some packages
```sh
$ apt-get install nodejs npm git
```
so clone the project
```sh
$ git clone https://github.com/miton18/web-proxy
```
Install all dependances
```sh
$ cd web-proxy && npm install 
$ npm install -g gulp
$ gulp
```

## Configuration
So edit the main.coffee file to change your domain name, default is 'rcdinfo.fr' it's mine ;-).
Change  the routes.json file to add your redirections
and copy the runing systemd file (web-proxy.service) into /etc/systemd/system

```sh
$ sudo cp ./web-proxy.service /etc/systemd/system/
$ # change web-proxy.service to find the main.js path
$ sudo systemctl daemon-reload && sudo systemctl start web-proxy
```
done? so it have to work....






