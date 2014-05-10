/*!
 * koa-limit - lib/limit.js
 * Copyright(c) 2014 dead_horse <dead_horse@qq.com>
 * MIT Licensed
 */

'use strict';

/**
 * Module dependencies.
 */

var debug = require('debug')('koa-limit');
var ipchecker = require('ipchecker');
var Store = require('./store');

var defaultOptions = {
  interval: 1000 * 60 * 60 * 24,
  limit: 1000,
  whiteList: [],
  blackList: [],
  token: 'koa-limit',
  message: 'request frequency limited',
};

/**
 * limit by ip
 * @param {Object} options
 *   - {Number} interval
 *   - {Number} limit
 *   - {Array} whiteList
 *   - {Array} blackList
 *   - {String} token
 *   - {Object} store
 *   - {String} message
 * @return {[type]} [description]
 */

module.exports = function (options) {
  options = options || {};

  // merge with default
  for (var key in defaultOptions) {
    if (!options[key]) options[key] = defaultOptions[key];
  }

  var store = new Store({
    client: options.store,
    ttl: options.interval / 1000,
    token: options.token
  });

  var whiteListMap = ipchecker.map(options.whiteList);
  var blackListMap = ipchecker.map(options.blackList);

  return function *limit(next) {
    var ip = this.ip;

    if (!ip) {
      debug('can not get ip for the request');
      return yield *next;
    }

    // check black list
    if (ipchecker.check(ip, blackListMap)) {
      debug('request ip: %s is in the blackList', ip);
      this.status = 403;
      this.body = options.message;
      return;
    }
    // check white list
    if (ipchecker.check(ip, whiteListMap)) {
      debug('request ip: %s is in the whiteList', ip);
      return yield *next;
    }
    // check frequency
    var times;
    try {
      times = yield store.get(ip);
    } catch (err) {
      console.warn('get from store error: ', err.message);
      return yield *next;
    }
    var now = Date.now();

    var delta = options.interval - (now % options.interval);
    var reset = (now + delta) / 1000 | 0;
    var remaining = Math.max(options.limit - times - 1, 0);

    this.set('X-RateLimit-Limit', options.limit);
    this.set('X-RateLimit-Remaining', remaining);
    this.set('X-RateLimit-Reset', reset);

    debug('ip: %s request times: %d', ip, times);
    if (times >= options.limit) {
      debug('request frequency limited');
      this.set('Retry-After', delta / 1000 | 0);
      this.status = 429;
      this.body = options.message;
      return;
    }

    yield *next;

    // record
    yield store.record(ip);
  }
};
