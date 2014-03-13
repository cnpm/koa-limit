koa-limit [![Build Status](https://travis-ci.org/dead-horse/koa-limit.png)](https://travis-ci.org/dead-horse/koa-limit)
=========

koa middleware for limit request by ip

## Install

```
npm install koa-limit
```

## Usage

```js
var koa = require('koa');
var favicon = require('koa-favicon');
var limit = require('./');

var app = koa();
// If you are using reverse proxy on the front of node, like 'nginx', please set this
// app.proxy = true;
app.use(favicon());
app.use(limit({
  limit: 1000,
  interval: 1000 * 60 * 60
}));

app.use(function *() {
  this.body = 'hello';
});

app.listen(7001);
```

### Options

* **limit**: limit request number, default is 1000.
* **interval**: limit refresh interval in ms, default is one day.
* **token**: prefix key, for isolate different koa-limit, default is `koa-limit`, if you want to use more than one `koa-limit` in a project, you must set different token!!
* **store**: can be set with a redis store, or other store with API in [MemoryStore](https://github.com/dead-horse/koa-limit/blob/master/lib/memory_store.js). default store is `MemoryStore`.
* **whiteList**: all ips in whiteList won't be limited.
* **blackList**: all ips in blackList will 403.
* **message**: forbidden message, defautl is 'request frequency limited'.

### Redis Store

checkout the [example.js](https://github.com/dead-horse/koa-limit/blob/master/example.js), see how to use `koa-limit` with redis.

## License

MIT
