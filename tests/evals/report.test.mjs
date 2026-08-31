// Aggregation is what turns per-README findings into the comparison the benchmark
// exists to make, so it gets its own checks rather than only running end to end.

import test from 'node:test';
import assert from 'node:assert/strict';
import { aggregate } from './report.mjs';

const scored = (agent, mode, scenario, counts, checked) => ({
  agent,
  mode,
  scenario,
  producedReadme: true,
  counts: {
    unsupportedClaim: 0, invalidCommand: 0, invalidBadge: 0, brokenLink: 0, missingInformation: 0, ...counts,
  },
  errors: Object.values(counts).reduce((total, value) => total + value, 0),
  checked,
});

test('one row per agent and mode, sorted', () => {
  const rows = aggregate([
    scored('cursor', 'skill', 'node-package', { invalidCommand: 1 }, 10),
    scored('claude-code', 'baseline', 'node-package', { brokenLink: 2 }, 10),
    scored('claude-code', 'skill', 'node-package', {}, 10),
  ]);

  assert.deepEqual(
    rows.map((row) => `${row.agent}/${row.mode}`),
    ['claude-code/baseline', 'claude-code/skill', 'cursor/skill'],
  );
});

test('counts and rates add up across scenarios', () => {
  const [row] = aggregate([
    scored('claude-code', 'baseline', 'node-package', { invalidCommand: 2, brokenLink: 1 }, 20),
    scored('claude-code', 'baseline', 'cli-app', { invalidBadge: 1 }, 20),
  ]);

  assert.equal(row.repositories, 2);
  assert.equal(row.scored, 2);
  assert.equal(row.counts.invalidCommand, 2);
  assert.equal(row.counts.brokenLink, 1);
  assert.equal(row.counts.invalidBadge, 1);
  assert.equal(row.errors, 4);
  assert.equal(row.hallucinationRate, 0.1);
});

test('a case that produced no README counts as a repository but is not scored', () => {
  const [row] = aggregate([
    scored('codex', 'skill', 'node-package', { invalidCommand: 1 }, 10),
    { agent: 'codex', mode: 'skill', scenario: 'cli-app', producedReadme: false },
  ]);

  assert.equal(row.repositories, 2, 'the attempt still counts as a repository in the matrix');
  assert.equal(row.scored, 1, 'only the README that exists is scored');
  assert.equal(row.errors, 1);
  assert.equal(row.hallucinationRate, 0.1, 'the missing README does not dilute the rate');
});

test('an agent that produced nothing at all reports a rate of zero, not a division by zero', () => {
  const [row] = aggregate([{ agent: 'codex', mode: 'skill', scenario: 'cli-app', producedReadme: false }]);

  assert.equal(row.scored, 0);
  assert.equal(row.hallucinationRate, 0);
});
