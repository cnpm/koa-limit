
var koa = require('koa');
var favicon = require('koa-favicon');
var limit = require('./');

var app = koa();
app.use(favicon());
app.use(limit({
  limit: 3,
}));

app.use(function *() {
  this.body = 'hello';
});

app.listen(7001);
