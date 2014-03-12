/*!
 * koa-limit - lib/memory_store.js
 * Copyright(c) 2014 dead_horse <dead_horse@qq.com>
 * MIT Licensed
 */

'use strict';

/**
 * Expose `MemoryStore`
 */
module.exports = MemoryStore;

function MemoryStore() {
  this.store = {};
}

MemoryStore.prototype.hget = function *(hashKey, field) {
  if (!this.store[hashKey]) return 0;

  return this.store[hashKey][field] || 0;
};

MemoryStore.prototype.hincrby = function *(hashKey, field, value) {
  if (!this.store[hashKey]) {
    this.store[hashKey] = {};
    this.store[hashKey][field] = 0;
  }
  if (!this.store[hashKey][field]) {
    this.store[hashKey][field] = 0;
  }
  this.store[hashKey][field] += value;
};

MemoryStore.prototype.del = function *(hashKey) {
  delete this.store[hashKey];
};
