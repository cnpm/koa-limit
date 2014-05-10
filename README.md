koa-limit [![Build Status](https://travis-ci.org/koajs/koa-limit.png)](https://travis-ci.org/koajs/koa-limit)
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
* **store**: can be set with a redis store, or other store with API in [MemoryStore](https://github.com/koajs/koa-limit/blob/master/lib/memory_store.js). default store is `MemoryStore`.
* **whiteList**: all ips in whiteList won't be limited.
* **blackList**: all ips in blackList will 403.
* **message**: forbidden message, defautl is 'request frequency limited'.

### Redis Store

checkout the [example.js](https://github.com/koajs/koa-limit/blob/master/example.js), see how to use `koa-limit` with redis.

### Different with [koa-ratelimit](https://github.com/koajs/ratelimit)

1. you can use memory to store all these rates.
2. support `whiteList` and `blackList`
3. easy to store in other DBs.
4. message customable

## Authors

```
$ git summary

 project  : koa-limit
 repo age : 2 days ago
 commits  : 21
 active   : 2 days
 files    : 15
 authors  :
    19  dead_horse              90.5%
     1  Po-Ying Chen            4.8%
     1  fengmk2                 4.8%
```

## License

The MIT License (MIT)

Copyright (c) 2014 dead_horse

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.%
