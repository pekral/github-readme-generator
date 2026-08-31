import test from 'node:test';
import assert from 'node:assert/strict';
import { retry, backoff, CancellationToken } from '../src/index.js';

test('retries until the operation succeeds', async () => {
  let attempts = 0;
  const value = await retry(() => {
    attempts += 1;
    if (attempts < 3) throw new Error('not yet');

    return 'ok';
  });

  assert.equal(value, 'ok');
});

test('backoff grows exponentially and is capped', () => {
  assert.equal(backoff(0), 100);
  assert.equal(backoff(50), 5000);
});

test('a cancelled token stops the loop', async () => {
  const token = new CancellationToken();
  token.cancel();
  await assert.rejects(() => retry(() => 'never', { token }), /cancelled/);
});
