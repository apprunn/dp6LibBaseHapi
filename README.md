# dp6LibBaseHapi [![CircleCI](https://circleci.com/gh/apprunn/dp6-lic-base-hapi.svg?style=svg)](https://circleci.com/gh/apprunn/)

> A base hapi configuration for my new API projects

### Pre-Requisites

1.  node 8.10 or greater
2.  npm 6.1.0 or greater
3.  redis 4.0 or greater

### Usage

```javascript
const baseConfig = require('base-hapi');
(async () => {
	const server = await baseConfig;
	await server.start();
	console.log(`Server started at ${server.info.uri}`);
	// server started at http://localhost:4000
})();
```

If you want to change the HOST and PORT you can do it by setting up two variable environments

```bash
HOST=192.168.1.25
PORT=2000
```

### Configuration

Out of the box base-hapi comes with many defaults:

1.  Catbox Redis with the following configuration

```javascript
{
  name: process.env.CATBOX_REDIS_NAME || 'catbox-redis',
  // engine: require(catbox-redis),
  partition: process.env.CATBOX_PARTITION_NAME || 'cache',
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIST_PORT || 6379,
},
```

2.  Sentry for logging management. You will need an account [here](https://docs.sentry.io/quickstart/#)
    Now you can pass your sentry environment and dsn with these environment variables

```javascript
options: {
  environment: process.env.NODE_ENV,
  dsn: process.env.SENTRY_DNS,
},
```

3.  For authentication you must define a function with your logic inside of it.

```javascript
async function validate(token) {
  // your custom validation here
  // return true to pass to the handler
  // return false to return a 401 to client
  // credentials can be used inside your handlers in the request object
  // request.auth.credentials
  return { isValid: true, credentials: { id: 1 } };
}

const server = await baseConfig({ validate });
```

4.  Adding plugins

```javascript
const myPlugin = {
  name: 'my-plugin',
  register(server) {
    server.route({
      handler() {
        return 'I am a plugin';
      },
      method: 'GET',
      path: '/my-plugin',
    });
  },
  version: '1.0.0',
};
const plugins = [myPlugin];
const server = await baseConfig({ plugins });
```

5.  The objection-paginate plugin is included.

```javascript
const server = await baseConfig();
server.route({
  method: 'GET',
  path: '/pagination',
  handler(request, h) {
    return h.paginate({ results: [], total: 20 }, request.query);
  },
});
```

If you do not specify a limit in the query parameters it will use the OFFSET_DEFAULT environment variable

```bash
OFFSET_DEFAULT = 10
```
