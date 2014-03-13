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

  // TODO add 10.232.*.* support
  function checkIp(ip, list) {
    for (var i = 0; i < list.length; i++) {
      if (ip === list[i]) {
        return true;
      }
    }
    return false;
  }

  return function *limit(next) {
    var ip = this.ip;

    if (!ip) {
      debug('can not get ip for the request');
      return yield *next;
    }

    // check black list
    if (checkIp(ip, options.blackList)) {
      debug('request ip: %s is in the blackList', ip);
      return this.throw(403, options.message);
    }
    // check white list
    if (checkIp(ip, options.whiteList)) {
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

    debug('ip: %s request times: %d', ip, times);
    if (times >= options.limit) {
      debug('request frequency limited');
      return this.throw(403, options.message);
    }

    yield *next;

    // record
    yield store.record(ip);
  }
};
