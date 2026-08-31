import test from 'node:test';
import assert from 'node:assert/strict';
import { palette } from '../src/index.js';

test('produces the requested number of steps', () => {
  assert.equal(palette('#336699', { steps: 3 }).length, 3);
});
