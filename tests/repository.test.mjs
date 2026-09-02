// Structural checks on the repository itself: the files the skill needs, the links
// its documentation makes, and the version the three manifests agree on.
//
// Run with: node --test tests/repository.test.mjs
//
// A project about not making unverifiable claims should be able to prove its own.

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, dirname, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SKILL_DIR = join(ROOT, 'skills', 'github-readme-generator');

// Major.minor.patch with an optional prerelease, so a beta can be released the
// same way a stable version is: 1.0.0, 1.0.0-beta.1, 2.0.0-rc.2.
const VERSION = String.raw`\d+\.\d+\.\d+(?:-[0-9A-Za-z.]+)?`;

const read = (path) => readFileSync(join(ROOT, path), 'utf8');
const exists = (path) => existsSync(join(ROOT, path));

/** Every Markdown file the project maintains, excluding recorded agent output. */
function documentation() {
  const found = [];

  const walk = (directory) => {
    for (const entry of readdirSync(join(ROOT, directory), { withFileTypes: true })) {
      const path = join(directory, entry.name);
      // Fixtures and recorded results are data, not documentation this project maintains.
      if (entry.isDirectory()) {
        if (['node_modules', '.git', 'fixtures', 'results'].includes(entry.name)) continue;
        walk(path);
        continue;
      }
      if (entry.name.endsWith('.md')) found.push(path);
    }
  };

  walk('.');

  return found.sort();
}

/** Markdown links outside fenced code blocks: a link in an example is not a live link. */
function linksOutsideCode(markdown) {
  const links = [];
  let fence = null;
  let lineNumber = 0;

  for (const line of markdown.split('\n')) {
    lineNumber += 1;
    const marker = line.match(/^\s*(`{3,}|~{3,})/);

    if (marker) {
      if (fence === null) fence = marker[1].length;
      else if (marker[1].length >= fence) fence = null;
      continue;
    }
    if (fence !== null) continue;

    for (const match of line.matchAll(/(!)?\[[^\]]*\]\(\s*([^)\s]+)/g)) {
      links.push({ target: match[2], line: lineNumber, isImage: Boolean(match[1]) });
    }
  }

  return links;
}

test('the skill ships every file it declares', () => {
  const required = [
    'SKILL.md',
    'LICENSE.md',
    'references/readme-structure.md',
    'references/evidence-policy.md',
    'references/validation-checklist.md',
  ];

  for (const file of required) {
    assert.ok(existsSync(join(SKILL_DIR, file)), `skills/github-readme-generator/${file} is missing`);
  }
});

test('the skill frontmatter names the skill and describes it', () => {
  const frontmatter = read('skills/github-readme-generator/SKILL.md').match(/^---\n([\s\S]*?)\n---/);
  assert.ok(frontmatter, 'SKILL.md has no frontmatter');

  const name = frontmatter[1].match(/^name:\s*(.+)$/m);
  const description = frontmatter[1].match(/^description:\s*(.+)$/m);

  assert.ok(name, 'SKILL.md declares no name');
  assert.equal(name[1].trim(), 'github-readme-generator', 'the declared name must match the directory');
  assert.ok(description && description[1].trim().length > 40, 'SKILL.md needs a description agents can match against');
});

test('every reference SKILL.md points at exists', () => {
  const skill = read('skills/github-readme-generator/SKILL.md');

  for (const match of skill.matchAll(/`(references\/[a-z-]+\.md)`/g)) {
    assert.ok(existsSync(join(SKILL_DIR, match[1])), `SKILL.md points at ${match[1]}, which does not exist`);
  }
});

test('the skill carries its own copy of the licence, identical to the root one', () => {
  assert.equal(
    read('skills/github-readme-generator/LICENSE.md'),
    read('LICENSE.md'),
    'installers copy the skill directory alone, so its licence copy must match the root',
  );
});

test('every relative documentation link resolves', () => {
  const broken = [];

  for (const file of documentation()) {
    const base = dirname(join(ROOT, file));

    for (const { target, line } of linksOutsideCode(read(file))) {
      // Absolute URLs, anchors, and GitHub's own relative shortcuts are out of scope.
      if (/^[a-z][a-z0-9+.-]*:/i.test(target) || target.startsWith('#') || target.startsWith('../../')) continue;

      const path = decodeURI(target.split('#')[0].split('?')[0]);
      if (path === '') continue;
      if (!existsSync(resolve(base, path))) broken.push(`${file}:${line} -> ${target}`);
    }
  }

  assert.deepEqual(broken, [], `broken relative links:\n${broken.join('\n')}`);
});

test('every documented example path exists', () => {
  const examples = 'docs/examples';
  assert.ok(exists(examples), 'docs/examples is missing');

  const pages = readdirSync(join(ROOT, examples)).filter((name) => name.endsWith('.md'));
  assert.ok(pages.length >= 4, 'the examples index plus at least three examples');

  for (const page of pages) {
    const content = read(join(examples, page));

    for (const match of content.matchAll(/`(tests\/evals\/fixtures\/[a-z-]+\/repo)`/g)) {
      assert.ok(exists(match[1]), `${examples}/${page} names ${match[1]}, which does not exist`);
    }
  }
});

test('every test scenario has a row in the host coverage table', () => {
  const scenarios = read('tests/scenarios.md');
  const numbers = [...scenarios.matchAll(/^## (\d+)\. /gm)].map((match) => match[1]);
  assert.ok(numbers.length >= 10, 'the scenario suite should not shrink silently');

  const table = scenarios.slice(scenarios.indexOf('## Host coverage log'));
  for (const number of numbers) {
    assert.match(table, new RegExp(`^\\| ${number} \\|`, 'm'), `scenario ${number} has no host coverage row`);
  }
});

test('every benchmark fixture is a directory with a repository and a ground truth', () => {
  const fixtures = 'tests/evals/fixtures';

  for (const name of readdirSync(join(ROOT, fixtures))) {
    if (!statSync(join(ROOT, fixtures, name)).isDirectory()) continue;
    assert.ok(exists(join(fixtures, name, 'repo')), `${fixtures}/${name} has no repo/`);
    assert.ok(exists(join(fixtures, name, 'truth.json')), `${fixtures}/${name} has no truth.json`);
  }
});

test('the three manifests agree on one version', () => {
  const plugin = JSON.parse(read('.claude-plugin/plugin.json'));
  const marketplace = JSON.parse(read('.claude-plugin/marketplace.json'));
  const codex = JSON.parse(read('.codex-plugin/plugin.json'));

  const entry = marketplace.plugins.find((item) => item.name === plugin.name);
  assert.ok(entry, `the marketplace lists no plugin named ${plugin.name}`);

  assert.equal(entry.version, plugin.version, 'the marketplace entry and the plugin manifest disagree');
  assert.equal(codex.version, plugin.version, 'the Codex manifest disagrees with the Claude Code one');
  assert.match(plugin.version, new RegExp(`^${VERSION}$`), 'the version is not semantic');
  assert.equal(codex.name, plugin.name, 'the two plugin manifests name different plugins');
});

test('the changelog accounts for the version the manifests declare', () => {
  const version = JSON.parse(read('.claude-plugin/plugin.json')).version;
  const changelog = read('CHANGELOG.md');
  const headings = [...changelog.matchAll(/^## (.+)$/gm)].map((match) => match[1].trim());

  assert.ok(headings.length > 0, 'the changelog has no sections');

  const isRelease = new RegExp(`^${VERSION} `);
  const released = headings.filter((heading) => isRelease.test(heading)).map((heading) => heading.split(' ')[0]);
  assert.ok(
    released.includes(version) || headings[0] === 'Unreleased',
    `the manifests declare ${version}, which the changelog neither released nor supersedes with an Unreleased section`,
  );

  // A released heading carries its date, so a reader can tell when it shipped.
  for (const heading of headings.filter((item) => isRelease.test(item))) {
    assert.match(
      heading,
      new RegExp(`^${VERSION} - \\d{4}-\\d{2}-\\d{2}$`),
      `changelog heading "${heading}" has no release date`,
    );
  }
});

test('a released version has a matching tag, and a tag has a matching changelog entry', () => {
  // A shallow checkout carries no tags, and neither does a plain download. With none
  // to compare, the check is vacuous rather than wrong.
  let tags = [];
  try {
    tags = execFileSync('git', ['tag', '--list'], { cwd: ROOT, encoding: 'utf8' })
      .split('\n').map((tag) => tag.trim()).filter(Boolean);
  } catch {
    return;
  }
  if (tags.length === 0) return;

  const changelog = read('CHANGELOG.md');
  const released = [...changelog.matchAll(new RegExp(`^## (${VERSION}) `, 'gm'))].map((match) => match[1]);

  for (const tag of tags) {
    const version = tag.replace(/^v/, '');
    assert.ok(released.includes(version), `tag ${tag} has no ${version} section in the changelog`);
  }
});

test('no documentation file is empty', () => {
  for (const file of documentation()) {
    assert.ok(read(file).trim().length > 0, `${relative(ROOT, file)} is empty`);
  }
});
