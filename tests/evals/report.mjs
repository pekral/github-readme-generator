// Scores a recorded run and writes the machine-readable and human-readable summaries.
// Deterministic: rerunning it on the same results directory reproduces byte-identical output.

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { scoreFile } from './score.mjs';

const EVALS_DIR = dirname(fileURLToPath(import.meta.url));
const FIXTURES_DIR = join(EVALS_DIR, 'fixtures');
const RESULTS_DIR = join(EVALS_DIR, 'results');
const KINDS = ['unsupportedClaim', 'invalidCommand', 'invalidBadge', 'brokenLink', 'missingInformation'];

const directories = (path) => (existsSync(path)
  ? readdirSync(path, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name).sort()
  : []);

function emptyCounts() {
  return Object.fromEntries(KINDS.map((kind) => [kind, 0]));
}

export function scoreRun(runDir) {
  const cases = [];

  for (const agent of directories(runDir)) {
    for (const mode of directories(join(runDir, agent))) {
      for (const scenario of directories(join(runDir, agent, mode))) {
        const caseDir = join(runDir, agent, mode, scenario);
        const readme = join(caseDir, 'README.md');
        const meta = existsSync(join(caseDir, 'meta.json'))
          ? JSON.parse(readFileSync(join(caseDir, 'meta.json'), 'utf8'))
          : {};

        if (!existsSync(readme)) {
          cases.push({ agent, mode, scenario, producedReadme: false, meta });
          continue;
        }

        const result = scoreFile(readme, join(FIXTURES_DIR, scenario));
        writeFileSync(join(caseDir, 'findings.json'), `${JSON.stringify(result, null, 2)}\n`);
        cases.push({ agent, mode, scenario, producedReadme: true, meta, ...result });
      }
    }
  }

  return cases;
}

export function aggregate(cases) {
  const rows = new Map();

  for (const item of cases) {
    const key = `${item.agent} ${item.mode}`;
    if (!rows.has(key)) {
      rows.set(key, {
        agent: item.agent,
        mode: item.mode,
        repositories: 0,
        scored: 0,
        counts: emptyCounts(),
        errors: 0,
        checked: 0,
      });
    }
    const row = rows.get(key);
    row.repositories += 1;
    if (!item.producedReadme) continue;
    row.scored += 1;
    row.errors += item.errors;
    row.checked += item.checked;
    for (const kind of KINDS) row.counts[kind] += item.counts[kind];
  }

  return [...rows.values()]
    .map((row) => ({
      ...row,
      hallucinationRate: row.checked === 0 ? 0 : Number((row.errors / row.checked).toFixed(4)),
    }))
    .sort((a, b) => a.agent.localeCompare(b.agent) || a.mode.localeCompare(b.mode));
}

function markdown(runId, run, rows, cases) {
  const missing = cases.filter((item) => !item.producedReadme);
  const lines = [
    `# Benchmark run \`${runId}\``,
    '',
    `- Prompt: \`${run.prompt ?? 'unknown'}\``,
    `- Model: ${run.model ?? 'unknown'}`,
    `- Skill commit: \`${run.skillCommit ?? 'unknown'}\``,
    `- Started: ${run.startedAt ?? 'unknown'}`,
    '',
    '| Agent | Mode | Repositories | Unsupported claims | Invalid commands | Invalid badges | Broken links | Missing information | Hallucination rate |',
    '| --- | --- | --- | --- | --- | --- | --- | --- | --- |',
  ];

  for (const row of rows) {
    lines.push(`| ${row.agent} | ${row.mode} | ${row.repositories} | ${row.counts.unsupportedClaim} | `
      + `${row.counts.invalidCommand} | ${row.counts.invalidBadge} | ${row.counts.brokenLink} | `
      + `${row.counts.missingInformation} | ${row.hallucinationRate} |`);
  }

  lines.push(
    '',
    'Hallucination rate is errors divided by verifiable statements (commands, badges, links, and',
    'the ground truth required and forbidden checks). Lower is better; 0 means the README invented',
    'nothing and omitted nothing the fixture proves.',
  );

  if (missing.length > 0) {
    lines.push('', '## Cases that produced no README', '');
    for (const item of missing) lines.push(`- ${item.agent} / ${item.mode} / ${item.scenario}`);
  }

  return `${lines.join('\n')}\n`;
}

export function main(argv) {
  const runId = argv[0];
  if (!runId) {
    console.error('Usage: node tests/evals/report.mjs <run id>');
    console.error('');
    console.error('Recorded runs:');
    for (const id of directories(RESULTS_DIR)) console.error(`  ${id}`);
    return 2;
  }

  const runDir = resolve(RESULTS_DIR, runId);
  if (!existsSync(runDir)) throw new Error(`No such run: ${runDir}`);

  const run = existsSync(join(runDir, 'run.json'))
    ? JSON.parse(readFileSync(join(runDir, 'run.json'), 'utf8'))
    : {};
  const cases = scoreRun(runDir);
  const rows = aggregate(cases);

  writeFileSync(join(runDir, 'summary.json'), `${JSON.stringify({ runId, run, rows, cases }, null, 2)}\n`);
  writeFileSync(join(runDir, 'summary.md'), markdown(runId, run, rows, cases));

  console.log(markdown(runId, run, rows, cases));
  console.log(`Wrote ${join(runDir, 'summary.json')} and ${join(runDir, 'summary.md')}`);
  return 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    process.exit(main(process.argv.slice(2)));
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}
