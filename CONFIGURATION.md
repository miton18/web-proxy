# Configure the project

The application will look for configuration files in this order and path.
When a configuration file is found, it use it and don't look for another one.

- `/etc/web-proxy/config.js`
- `/usr/share/web-proxy/config.js`
- `{project_path}/config.js`

## Environment variables or configuration file

Both are possible, you can put a configuration file and some environement variables.
Keep in mind, all parameters are available in this 2 modes.
An environement variable override a configuration file property.

You can use `config.sample.js` file

For example: 
if in your environement you have: 
```
PROXY_MY_CONFIG_PARAMETER=1
```
his equivalent in configuration file is:
```
module.exports = {
    proxyMyConfigParameter: 1
}
```

### Environment variables

|Variable name|Default value|Variable utility|required|
|-------------|----------------|-------------|--------|
|PROXY_TRACE_KEY|null|Set the environment variable to use [@risingstack/trace](https://npmjs.com/package/@risingstack/trace)|:x:|
|PROXY_WINSTON_OVH_CREDENTIAL|null|Set the environment variable to export your data with [winston-ovh](https://npmjs.com/package/winston-ovh)|:x:|
|PROXY_MONGODB_ADDON_USER|null|user to authenticate to mongdb|:x:|
|PROXY_MONGODB_ADDON_PASSWORD|null|password to authenticate to mongdb|:x:|
|PROXY_MONGODB_ADDON_HOST|null|host of mongodb|:x:|
|PROXY_MONGODB_ADDON_PORT|null|port of mongodb|:x:|
|PROXY_MONGODB_ADDON_DB|null|database to use in mongodb|:x:|
|PROXY_MONGODB_ADDON_URI|null|uri of mongodb if not present other variables is used to recreate it|:x:|
|MONGODB_ADDON_URI|null|uri compatibility to [clever-cloud](https://clever-cloud.io)|:x:|
|PROXY_API_PORT|8080|proxy api port|:x:|
|PROXY_API_PORT_SSL|8443|proxy SSL api port|:x:|
|PROXY_JWT_SECRET|null|jwt secret| :white_check_mark: |
|PROXY_JWT_ISSUER|null|jwt issuer|:x:|
|PROXY_JWT_AUDIENCE|null|jwt audience|:x:|
|PROXY_PEPPER|null|Pepper of the application, encrypt password|:x:|
|PROXY_WARP10_URI|null|URI to warp10|:x:|
|PROXY_WARP10_WRITE_TOKEN|null|Write token to warp10|:x:|
|PROXY_DOCKER_SOCKET|null|Give to proxy to manage container|:x:|
|PROXY_SSL_KEY|null|Static SSL configuration for proxy + API (secret key)|:x:|
|PROXY_SSL_CERT|null|Static SSL configuration for proxy + API (certificate)|:x:|
