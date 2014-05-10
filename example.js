
var koa = require('koa');
var favicon = require('koa-favicon');
var limit = require('./');
var redis = require('redis');
var wrapper = require('co-redis');
// var redisClient = require('redis').createClient();
// var client = wrapper(redisClient);

var app = koa();
app.use(favicon());
app.use(limit({
  limit: 3,
  interval: 100000,
  // store: client
}));

app.use(function *() {
  this.body = 'hello';
});

app.listen(7001);
