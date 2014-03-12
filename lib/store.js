/*!
 * koa-limit - lib/store.js
 * Copyright(c) 2014 dead_horse <dead_horse@qq.com>
 * MIT Licensed
 */

'use strict';

/**
 * Module dependencies.
 */

var MemoryStore = require('./memory_store');
var debug = require('debug')('koa-limit:store');

/**
 * Expose `Store`
 */
module.exports = Store;

function Store(options) {
  this.client = options.client || new MemoryStore();
  this.ttl = options.ttl;
  this.currentHashKey;
  this.token = options.token;
};

Store.prototype.genKey = function () {
  return this.token + ':' + Math.floor(Date.now() / this.ttl / 1000);
}

Store.prototype.get = function *(ip) {
  var hashKey = this.genKey();
  var times = yield this.client.hget(hashKey, ip);
  return parseInt(times || '0', 10);
};

Store.prototype.record = function *(ip) {
  var hashKey = this.genKey();
  try {
    yield this.client.hincrby(hashKey, ip, 1);

    if (this.currentHashKey !== hashKey) {
      debug('hashKey changed');
      if (this.client.expire) {
        debug('set expire ttl: %d', this.ttl);
        yield this.client.expire(hashKey, this.ttl);
      } else if (this.currentHashKey) {
        debug('delete old hashkey: %s', this.currentHashKey);
        yield this.client.del(this.currentHashKey);
      }
      this.currentHashKey = hashKey;
    }
  } catch (err) {
    console.warn('record error: ', err.message);
  }
};
