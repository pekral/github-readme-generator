import test from 'node:test';
import assert from 'node:assert/strict';
import { loadConfig } from '../src/config.js';

test('rejects an incomplete environment', () => {
  assert.throws(() => loadConfig({ APP_URL: 'http://localhost:3000' }), /Missing configuration/);
});
