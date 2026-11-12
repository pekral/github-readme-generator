// Tests for the parts of the runner that need no agent: which files a run keeps.
// Run with: node --test tests/evals/*.test.mjs

import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { writtenPages } from './run.mjs';

function tree(root, files) {
  for (const [path, content] of Object.entries(files)) {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    writeFileSync(join(root, path), content);
  }
}

test('a run keeps the pages the agent wrote or changed, and nothing else', () => {
  const root = mkdtempSync(join(tmpdir(), 'written-pages-run-'));
  const fixture = join(root, 'fixture');
  const workspace = join(root, 'workspace');

  try {
    tree(fixture, {
      'docs/kept.md': 'unchanged',
      'docs/edited.md': 'before',
      'src/index.js': 'code',
    });
    tree(workspace, {
      'README.md': 'the generated README',
      'docs/kept.md': 'unchanged',
      'docs/edited.md': 'after',
      'docs/skill-catalog.md': 'a moved section',
      'src/index.js': 'code',
      '.claude/skills/github-readme-generator/SKILL.md': 'the installed skill',
      'node_modules/pkg/README.md': 'a dependency',
    });

    assert.deepEqual(writtenPages(workspace, fixture), [join('docs', 'edited.md'), join('docs', 'skill-catalog.md')]);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
