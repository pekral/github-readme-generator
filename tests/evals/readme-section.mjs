// Renders the README's Benchmark section from a committed run, so every number in it
// is derived from `results/` rather than typed by hand — and `--check` fails when the
// two drift apart.
//
//   node tests/evals/readme-section.mjs <run id>           print the section
//   node tests/evals/readme-section.mjs <run id> --write    write it into README.md
//   node tests/evals/readme-section.mjs --check             verify README.md matches

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const EVALS_DIR = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(EVALS_DIR, '..', '..');
const RESULTS_DIR = join(EVALS_DIR, 'results');
const README = join(REPO_ROOT, 'README.md');

const END = '<!-- benchmark:end -->';
const startMarker = (runId) => `<!-- benchmark:start run=${runId} -->`;

const METRICS = [
  ['unsupportedClaim', 'Unsupported claims'],
  ['invalidCommand', 'Invalid commands'],
  ['invalidBadge', 'Invalid badges'],
  ['brokenLink', 'Broken links'],
  ['missingInformation', 'Missing information'],
];

function totals(rows, mode) {
  const inMode = rows.filter((row) => row.mode === mode);
  const counts = Object.fromEntries(METRICS.map(([key]) => [key, 0]));
  let errors = 0;
  let checked = 0;

  for (const row of inMode) {
    for (const [key] of METRICS) counts[key] += row.counts[key];
    errors += row.errors;
    checked += row.checked;
  }

  return { counts, errors, checked, scenarios: Math.max(0, ...inMode.map((row) => row.repositories)) };
}

/** A difference is only a percentage when there was something to improve on. */
function difference(baseline, skill) {
  if (baseline === skill) return '—';

  const delta = skill - baseline;
  if (baseline === 0) return `+${delta}`;

  return `${delta > 0 ? '+' : '−'}${Math.abs(delta)} (${Math.round((Math.abs(delta) / baseline) * 100)}% ${delta > 0 ? 'more' : 'fewer'})`;
}

function plural(count, singular, pluralForm = `${singular}s`) {
  return `${count} ${count === 1 ? singular : pluralForm}`;
}

/**
 * @param configured  agent id -> human label, from agents.json
 */
export function renderSection(summary, configured) {
  const { runId, run = {}, rows, cases = [] } = summary;
  const covered = [...new Set(rows.map((row) => row.agent))].sort();
  const label = (id) => configured[id] ?? id;
  const baseline = totals(rows, 'baseline');
  const skill = totals(rows, 'skill');
  const scenarios = Math.max(baseline.scenarios, skill.scenarios);
  const missingAgents = Object.keys(configured).filter((id) => !covered.includes(id)).sort();
  // An invocation can fail or time out. Counting it as a clean result would flatter
  // whichever mode it fell in, so the section says how many produced nothing.
  const unproduced = cases.filter((item) => item.producedReadme === false).length;

  const lines = [
    '## Benchmark',
    '',
    `Run \`${runId}\` gave ${plural(covered.length, 'agent')} — ${covered.map(label).join(', ')} — the same`,
    `plain prompt against ${plural(scenarios, 'fixture repository', 'fixture repositories')}, once without`,
    'the skill and once with it, and scored both with the same offline checker.',
    '',
    '| Metric | Baseline | With skill | Difference |',
    '| --- | ---: | ---: | ---: |',
  ];

  for (const [key, title] of METRICS) {
    lines.push(`| ${title} | ${baseline.counts[key]} | ${skill.counts[key]} | ${difference(baseline.counts[key], skill.counts[key])} |`);
  }

  lines.push(`| **Total findings** | **${baseline.errors}** | **${skill.errors}** | **${difference(baseline.errors, skill.errors)}** |`);
  lines.push('');

  if (baseline.errors === 0 && skill.errors === 0) {
    lines.push(
      'Both modes came out clean on this sample: the baseline invented nothing the fixtures',
      'contradict, and neither did the skill. The run therefore measures no difference — it is',
      'evidence that the harness works, not evidence that the skill helps.',
    );
  } else if (skill.errors < baseline.errors) {
    const percent = Math.round(((baseline.errors - skill.errors) / baseline.errors) * 100);
    lines.push(`${percent}% fewer findings with the skill, on this sample — ${plural(scenarios, 'repository', 'repositories')}`,
      `and ${plural(covered.length, 'agent')} in one run. Enough to report, not enough to generalise.`);
  } else if (skill.errors > baseline.errors) {
    lines.push('The skill scored worse than the baseline on this sample. The raw findings are committed;',
      'read them before drawing a conclusion from a single run.');
  }

  lines.push('');

  if (unproduced > 0) {
    lines.push(`${plural(unproduced, 'invocation')} produced no README at all — an agent error or a`,
      'timeout, not a scoring result. Those are counted in the run and scored as nothing; the',
      "run's `summary.md` names them.");
    lines.push('');
  }

  if (missingAgents.length > 0) {
    lines.push(`Not measured in this run: ${missingAgents.map(label).join(', ')}. The benchmark supports`,
      `${plural(Object.keys(configured).length, 'agent')}; a run covers whichever of them the machine it runs on`,
      'has installed and authenticated.');
    lines.push('');
  }

  // A benchmark number is a snapshot. Saying when it was taken, and of what, is the
  // difference between a reader judging its age and a reader assuming it is current.
  lines.push(provenance(runId, run), '');

  lines.push(
    `- Methodology, scoring rules, and how to add a scenario: [\`tests/evals/README.md\`](tests/evals/README.md)`,
    `- Raw results for this run, including every generated README and its findings: [\`tests/evals/results/${runId}/\`](tests/evals/results/${runId})`,
    `- Prompt, agent version, model, and skill commit for every invocation: the \`meta.json\` beside each result`,
    '',
    `The numbers above are rendered from \`summary.json\` by \`tests/evals/readme-section.mjs\`, and CI`,
    'fails if they stop matching the committed data.',
  );

  return lines.join('\n');
}

export function provenance(runId, run) {
  const when = run.startedAt ? run.startedAt.slice(0, 10) : 'an unrecorded date';
  const commit = run.skillCommit ? `\`${run.skillCommit.slice(0, 7)}\`` : 'an unrecorded commit';
  const caveat = run.skillCommitIsExact === false
    ? ' The skill directory had uncommitted changes when this ran, so that commit is approximate.'
    : '';

  return `Recorded on ${when}, against skill commit ${commit}.${caveat} A benchmark number is a`
    + ' snapshot of the skill as it was that day, not a live measurement — re-record it with'
    + ' `node tests/evals/run.mjs` when the skill changes in a way meant to affect accuracy.';
}

export function loadSummary(runId) {
  const path = join(RESULTS_DIR, runId, 'summary.json');
  if (!existsSync(path)) throw new Error(`No summary for run ${runId}. Score it first: node tests/evals/report.mjs ${runId}`);

  return JSON.parse(readFileSync(path, 'utf8'));
}

function configuredAgents() {
  const { agents } = JSON.parse(readFileSync(join(EVALS_DIR, 'agents.json'), 'utf8'));

  return Object.fromEntries(Object.entries(agents).map(([id, agent]) => [id, agent.label]));
}

/** Replaces whatever sits between the markers, and remembers which run it came from. */
export function spliceIntoReadme(readme, runId, section) {
  const start = readme.indexOf('<!-- benchmark:start');
  const end = readme.indexOf(END);
  if (start === -1 || end === -1) throw new Error(`README.md has no benchmark markers. Add "${startMarker(runId)}" and "${END}" where the section belongs.`);
  if (end < start) throw new Error('README.md has its benchmark markers the wrong way round.');

  return `${readme.slice(0, start)}${startMarker(runId)}\n\n${section}\n\n${readme.slice(end)}`;
}

export function runIdInReadme(readme) {
  const match = readme.match(/<!-- benchmark:start run=([^\s]+) -->/);
  if (!match) throw new Error('README.md names no benchmark run.');

  return match[1];
}

export function main(argv) {
  const check = argv.includes('--check');
  const write = argv.includes('--write');
  const readme = readFileSync(README, 'utf8');
  const runId = argv.find((argument) => !argument.startsWith('--')) ?? runIdInReadme(readme);

  const section = renderSection(loadSummary(runId), configuredAgents());

  if (check) {
    const expected = spliceIntoReadme(readme, runId, section);
    if (expected !== readme) {
      console.error(`README.md no longer matches run ${runId}.`);
      console.error('Regenerate it: node tests/evals/readme-section.mjs --write');

      return 1;
    }
    console.log(`README.md matches run ${runId}.`);

    return 0;
  }

  if (write) {
    writeFileSync(README, spliceIntoReadme(readme, runId, section));
    console.log(`README.md updated from run ${runId}.`);

    return 0;
  }

  console.log(section);

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
