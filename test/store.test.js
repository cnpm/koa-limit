/*!
 * koa-limit - test/store.test.js
 * Copyright(c) 2014 dead_horse <dead_horse@qq.com>
 * MIT Licensed
 */

'use strict';

/**
 * Module dependencies.
 */

var Store = require('../lib/store');
var co = require('co');
var should = require('should');
var mm = require('mm');

var store = new Store({
  ttl: 1000,
  token: 'koa-limit'
});

describe('test/store.test.js', function () {
  afterEach(mm.restore);
  describe('record()', function () {
    it('should record ip not exist ok', co(function *() {
      var key = store.genKey();
      yield store.record('127.0.0.1');
      store.currentHashKey.should.equal(key);
      (yield store.get('127.0.0.1')).should.equal(1);
    }));

    it('should record ip again ok', co(function *() {
      yield store.record('127.0.0.1');
      (yield store.get('127.0.0.1')).should.equal(2);
    }));

    it('should record ok when key changed', co(function *() {
      mm(store, 'genKey', function () {
        return 'new-key';
      });
      yield store.record('127.0.0.1');
      store.currentHashKey.should.equal('new-key');
      (yield store.get('127.0.0.1')).should.equal(1);
    }));
  });

  describe('get', function () {
    it('should get not exist ok', co(function *() {
      (yield store.get('127.0.0.2')).should.equal(0);
    }));

    it('should get not exist ok', co(function *() {
      yield store.record('127.0.0.1');
      yield store.record('127.0.0.1');
      yield store.record('127.0.0.1');
      (yield store.get('127.0.0.1')).should.equal(3);
    }));
  });
});
