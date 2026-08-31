import test from 'node:test';
import assert from 'node:assert/strict';
import { titleCase } from '@acme/core';

test('the CLI reuses the core helper', () => {
  assert.equal(titleCase('acme cli'), 'Acme Cli');
});
