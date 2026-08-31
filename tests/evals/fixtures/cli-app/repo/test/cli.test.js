import test from 'node:test';
import assert from 'node:assert/strict';
import { run } from '../bin/slugify.js';

test('prints help', () => {
  assert.match(run(['--help']), /Usage: slugify/);
});

test('slugifies text', () => {
  assert.equal(run(['Hello, World!']), 'hello-world');
});

test('honours --sep', () => {
  assert.equal(run(['--sep', '_', 'Hello, World!']), 'hello_world');
});
