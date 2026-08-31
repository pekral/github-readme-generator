// The README's benchmark section is generated, so its honesty is a property of this
// code rather than of whoever last edited the README. These are the claims it may make.

import test from 'node:test';
import assert from 'node:assert/strict';
import { renderSection, spliceIntoReadme, runIdInReadme } from './readme-section.mjs';

const AGENTS = { 'claude-code': 'Claude Code', codex: 'Codex', cursor: 'Cursor' };

const row = (agent, mode, repositories, counts) => ({
  agent,
  mode,
  repositories,
  scored: repositories,
  counts: {
    unsupportedClaim: 0, invalidCommand: 0, invalidBadge: 0, brokenLink: 0, missingInformation: 0, ...counts,
  },
  errors: Object.values(counts).reduce((total, value) => total + value, 0),
  checked: 100,
});

const summary = (rows, runId = 'a-run') => ({ runId, run: {}, rows });

test('a run where neither mode erred claims no improvement', () => {
  const section = renderSection(summary([
    row('claude-code', 'baseline', 10, {}),
    row('claude-code', 'skill', 10, {}),
  ]), AGENTS);

  assert.match(section, /measures no difference/);
  assert.doesNotMatch(section, /% fewer/, 'nothing to be fewer of');
  assert.match(section, /10 fixture repositories/);
  assert.match(section, /1 agent — Claude Code/);
});

test('an improvement is stated as a percentage of the sample, with the sample named', () => {
  const section = renderSection(summary([
    row('claude-code', 'baseline', 10, { unsupportedClaim: 6, invalidCommand: 2 }),
    row('claude-code', 'skill', 10, { unsupportedClaim: 2 }),
  ]), AGENTS);

  assert.match(section, /75% fewer findings with the skill, on this sample/);
  assert.match(section, /10 repositories/);
  assert.match(section, /not enough to generalise/);
  assert.match(section, /\| Unsupported claims \| 6 \| 2 \| −4 \(67% fewer\) \|/);
  assert.match(section, /\| \*\*Total findings\*\* \| \*\*8\*\* \| \*\*2\*\* \|/);
});

test('a regression is reported as a regression', () => {
  const section = renderSection(summary([
    row('claude-code', 'baseline', 2, {}),
    row('claude-code', 'skill', 2, { brokenLink: 3 }),
  ]), AGENTS);

  assert.match(section, /scored worse than the baseline/);
  assert.doesNotMatch(section, /% fewer/);
  assert.match(section, /\| Broken links \| 0 \| 3 \| \+3 \|/, 'a rise from zero has no percentage');
});

test('agents that were not measured are named, and covered ones are not', () => {
  const section = renderSection(summary([
    row('claude-code', 'baseline', 1, {}),
    row('claude-code', 'skill', 1, {}),
  ]), AGENTS);

  assert.match(section, /Not measured in this run: Codex, Cursor/);
  assert.doesNotMatch(section, /Not measured in this run:[^.]*Claude Code/);
});

test('a run covering every agent claims no gap', () => {
  const section = renderSection(summary(
    Object.keys(AGENTS).flatMap((agent) => [row(agent, 'baseline', 1, {}), row(agent, 'skill', 1, {})]),
  ), AGENTS);

  assert.doesNotMatch(section, /Not measured/);
  assert.match(section, /3 agents — Claude Code, Codex, Cursor/);
});

test('scenarios are counted once, not once per agent', () => {
  const section = renderSection(summary(
    Object.keys(AGENTS).flatMap((agent) => [row(agent, 'baseline', 10, {}), row(agent, 'skill', 10, {})]),
  ), AGENTS);

  assert.match(section, /10 fixture repositories/);
  assert.doesNotMatch(section, /30 fixture repositories/, 'three agents over ten fixtures is ten repositories');
});

test('markers in the wrong order are refused', () => {
  const inverted = '<!-- benchmark:end -->\ntext\n<!-- benchmark:start run=x -->\n';

  assert.throws(() => spliceIntoReadme(inverted, 'x', 'y'), /wrong way round/);
});

test('the section links its own raw results', () => {
  const section = renderSection(summary([row('claude-code', 'baseline', 1, {})], 'some-run'), AGENTS);

  assert.match(section, /tests\/evals\/results\/some-run/);
  assert.match(section, /tests\/evals\/README\.md/);
});

test('splicing replaces the marked block and stamps the run it came from', () => {
  const readme = [
    '# Title',
    '',
    '<!-- benchmark:start run=old-run -->',
    '',
    'stale text',
    '',
    '<!-- benchmark:end -->',
    '',
    '## Next section',
  ].join('\n');

  const spliced = spliceIntoReadme(readme, 'new-run', '## Benchmark\n\nfresh text');

  assert.match(spliced, /<!-- benchmark:start run=new-run -->/);
  assert.doesNotMatch(spliced, /stale text/);
  assert.match(spliced, /fresh text/);
  assert.match(spliced, /## Next section/, 'content after the end marker survives');
  assert.equal(runIdInReadme(spliced), 'new-run');
});

test('splicing a README without markers explains what to add', () => {
  assert.throws(() => spliceIntoReadme('# Title\n', 'a-run', 'x'), /benchmark:start run=a-run/);
});
