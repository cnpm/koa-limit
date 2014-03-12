/*!
 * koa-limit - test/memory_store.test.js
 * Copyright(c) 2014 dead_horse <dead_horse@qq.com>
 * MIT Licensed
 */

'use strict';

/**
 * Module dependencies.
 */

var MemoryStore = require('../lib/memory_store');
var co = require('co');
var should = require('should');

var store = new MemoryStore();
describe('test/lib/memory_store.test.js', function () {
  describe('hget()', function () {
    it('should get 0 if hashkey not exist', co(function *() {
      (yield store.hget('not_exist', 'field')).should.equal(0);
    }));

    it('should get 0 if field not exist', co(function *() {
      yield store.hincrby('exist', 'field', 1);
      (yield store.hget('exist', 'field_not_exist')).should.equal(0);
    }));

    it('should get ok', co(function *() {
      yield store.hincrby('hashkey', 'field', 1);
      (yield store.hget('hashkey', 'field')).should.equal(1);
    }));
  });

  describe('hincrby()', function () {
    it('should hincry not exist hashkey ok', co(function *() {
      yield store.hincrby('incr_key', 'field', 1);
      (yield store.hget('incr_key', 'field')).should.equal(1);
    }));

    it('should hincry not exist field ok', co(function *() {
      yield store.hincrby('incr_key', 'field_1', 1);
      (yield store.hget('incr_key', 'field_1')).should.equal(1);
    }));

    it('should hincry exist field ok', co(function *() {
      yield store.hincrby('incr_key', 'field_1', 1);
      (yield store.hget('incr_key', 'field_1')).should.equal(2);
    }));
  });
});
