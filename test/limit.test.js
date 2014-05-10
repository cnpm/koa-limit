/*!
 * koa-limit - test/limit.test.js
 * Copyright(c) 2014 dead_horse <dead_horse@qq.com>
 * MIT Licensed
 */

'use strict';

/**
 * Module dependencies.
 */

var limit = require('../');
var koa = require('koa');
var mm = require('mm');
var http = require('http');
var request = require('supertest');
var redis = require('redis');
var wrapper = require('co-redis');
var pedding = require('pedding');
var redisClient = require('redis').createClient();
var client = wrapper(redisClient);


function *hello() {
  this.body = 'hello';
}

var appRedis = koa();

appRedis.use(limit({
  token: 'koa-limit:' + process.pid,
  store: client,
  interval: 2000,
  limit: 1
}));

appRedis.use(hello);
appRedis = http.createServer(appRedis.callback());

var appBlack = koa();
appBlack.use(limit({
  blackList: ['127.0.0.*'],
  message: 'access forbidden, please concat foo@bar.com'
}));
appBlack.use(hello);
appBlack = http.createServer(appBlack.callback());

var appWhite = koa();
appWhite.use(limit({
  whiteList: ['127.0.*.*'],
  limit: 0
}));
appWhite.use(hello);
appWhite = http.createServer(appWhite.callback());

describe('test/limit.test.js', function () {
  afterEach(mm.restore);
  describe('blacklist', function () {
    it('should request blackList 403', function (done) {
      request(appBlack)
      .get('/')
      .expect('access forbidden, please concat foo@bar.com')
      .expect(403, done);
    });
  });

  describe('whiteList', function () {
    it('should request whit blackList 200', function (done) {
      request(appWhite)
      .get('/')
      .expect(200, done);
    });
  });

  describe('with redis', function () {

    it('should request 200 but redis record error', function (done) {
      mm(client, 'hincrby', function *() {
        throw new Error('mock error');
      });
      request(appRedis)
      .get('/')
      .expect(200, done);
    });

    it('should request 200', function (done) {
      request(appRedis)
      .get('/')
      .expect('X-RateLimit-Limit', '1')
      .expect('X-RateLimit-Remaining', '0')
      .expect('hello')
      .expect(200, done);
    });

    it('should request 429', function (done) {
      request(appRedis)
      .get('/')
      .expect('X-RateLimit-Limit', '1')
      .expect('X-RateLimit-Remaining', '0')
      .expect('request frequency limited')
      .expect(429, done);
    });

    it('should request 200 if redis get error', function (done) {
      mm(client, 'hget', function *() {
        throw new Error('mock error');
      });
      request(appRedis)
      .get('/')
      .expect(200, done);
    });

    it('should request ok after refresh', function (done) {
      setTimeout(function () {
      request(appRedis)
      .get('/')
      .expect('X-RateLimit-Limit', '1')
      .expect('X-RateLimit-Remaining', '0')
      .expect(200, done);
      }, 2000);
    });
  });
});
