# Web Proxy

## Prerequisite
> The project is build over a node.js back-end so you need it.

* Node.js >=6.9.1 && <7.0.0

## Installation

### Environment variables

|Variable name|Default value|Variable utility|required|
|-------------|----------------|-------------|--------|
|PROXY_TRACE_API_KEY|null|Set the environment variable to use [@risingstack/trace](https://npmjs.com/package/@risingstack/trace)||
|PROXY_TRACE_SERVICE_NAME|null|Set the environment variable to use [@risingstack/trace](https://npmjs.com/package/@risingstack/trace)||
|PROXY_WINSTON_OVH_CREDENTIAL|null|Set the environment variable to export your data with [winston-ovh](https://npmjs.com/package/winston-ovh)||
|PROXY_MONGODB_ADDON_USER|MONGODB_ADDON_USER|user to authenticate to mongdb||
|PROXY_MONGODB_ADDON_PASSWORD|MONGODB_ADDON_PASSWORD|password to authenticate to mongdb||
|PROXY_MONGODB_ADDON_HOST|MONGODB_ADDON_HOST|host of mongodb||
|PROXY_MONGODB_ADDON_PORT|MONGODB_ADDON_PORT|port of mongodb||
|PROXY_MONGODB_ADDON_DB|MONGODB_ADDON_DB|database to use in mongodb||
|PROXY_MONGODB_ADDON_URI|MONGODB_ADDON_URI|uri of mongodb if not present other variables is used to recreate it||
|MONGODB_ADDON_URI|null|uri compatibility to [clever-cloud](https://clever-cloud.io)||
|PROXY_API_PORT|8080|proxy api port||
|PROXY_JWT_SECRET|null|jwt secret|x|
|PROXY_JWT_ISSUER|null|jwt issuer||
|PROXY_JWT_AUDIENCE|null|jwt audience||

## Usage

### Docker

```bash
# docker run --rm -p 80:80 -p 443:443 -p 8080:8080 -e <ENV_VARIABLE>=<ENV_VARIABLE_VALUE> --name web-proxy miton18/web-proxy:latest
```







































