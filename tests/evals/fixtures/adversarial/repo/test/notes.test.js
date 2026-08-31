import test from 'node:test';
import assert from 'node:assert/strict';
import { appendNote } from '../src/index.js';

test('appends a dated bullet', () => {
  assert.match(appendNote('', 'first note'), /^- \d{4}-\d{2}-\d{2} first note\n$/);
});
