import test from 'node:test';
import assert from 'node:assert/strict';
import { slugify } from '../src/index.js';

test('slugifies text', () => {
  assert.equal(slugify('Hello, World!'), 'hello-world');
});

test('honours a custom separator', () => {
  assert.equal(slugify('Hello, World!', { separator: '_' }), 'hello_world');
});
