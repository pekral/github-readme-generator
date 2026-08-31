import test from 'node:test';
import assert from 'node:assert/strict';
import { titleCase } from '../src/index.js';

test('title-cases words', () => {
  assert.equal(titleCase('hello world'), 'Hello World');
});
