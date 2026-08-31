// Generates one README per (agent, mode, scenario) and records exactly how it was produced.
// Generation is the only step that costs money and is non-deterministic; scoring is separate.

import { readFileSync, writeFileSync, mkdirSync, existsSync, cpSync, readdirSync } from 'node:fs';
import { execFileSync, spawnSync } from 'node:child_process';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const EVALS_DIR = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(EVALS_DIR, '..', '..');
const FIXTURES_DIR = join(EVALS_DIR, 'fixtures');
const RESULTS_DIR = join(EVALS_DIR, 'results');
const MODES = ['baseline', 'skill'];
// An agent that retries a failing API call ignores SIGTERM and keeps going, so the
// deadline has to be enforced with a signal it cannot catch. One invocation once ran
// for 45 minutes past a 20-minute SIGTERM before giving up on a 502.
const INVOCATION_TIMEOUT_MS = 10 * 60 * 1000;

function parseArgs(argv) {
  const args = { agent: 'all', mode: 'both', scenario: 'all', model: null, runId: null, dryRun: false };
  for (let i = 0; i < argv.length; i += 1) {
    const [flag, inlineValue] = argv[i].split('=');
    const value = inlineValue ?? argv[i + 1];
    const consume = () => { if (inlineValue === undefined) i += 1; };
    switch (flag) {
      case '--agent': args.agent = value; consume(); break;
      case '--mode': args.mode = value; consume(); break;
      case '--scenario': args.scenario = value; consume(); break;
      case '--model': args.model = value; consume(); break;
      case '--run-id': args.runId = value; consume(); break;
      case '--dry-run': args.dryRun = true; break;
      case '--help': args.help = true; break;
      default: throw new Error(`Unknown option: ${flag}`);
    }
  }
  return args;
}

const HELP = `Usage: node tests/evals/run.mjs [options]

  --agent <id|all>       claude-code, codex, cursor; comma-separated (default: all)
  --mode <mode|both>     baseline, skill (default: both)
  --scenario <id|all>    directory names under tests/evals/fixtures; comma-separated (default: all)
  --model <name>         passed through to the agent CLI; recorded in meta.json
  --run-id <id>          results directory name (default: the current UTC timestamp)
  --dry-run              print what would run, invoke no agent, spend nothing

The full matrix is 3 agents x 2 modes x every scenario. Start with --dry-run.`;

export function readPrompt() {
  const prompts = readFileSync(join(EVALS_DIR, 'prompts.md'), 'utf8');
  const block = prompts.match(/## Prompt\s*\n+```text\n([\s\S]*?)\n```/);
  if (!block) throw new Error('prompts.md has no "## Prompt" text block.');
  return block[1].trim();
}

function listScenarios(selection) {
  const all = readdirSync(FIXTURES_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
  if (selection === 'all') return all;

  const chosen = selection.split(',').map((name) => name.trim()).filter(Boolean);
  for (const name of chosen) if (!all.includes(name)) throw new Error(`Unknown scenario: ${name}`);

  return chosen;
}

function buildCommand(agent, { prompt, workspace, model }) {
  const substitute = (part) => part
    .replaceAll('{{prompt}}', prompt)
    .replaceAll('{{workspace}}', workspace)
    .replaceAll('{{model}}', model ?? '');
  const command = agent.command.map(substitute);
  if (model) command.push(...agent.modelFlag.map(substitute));
  return command;
}

function toolVersion(versionCommand) {
  try {
    return execFileSync(versionCommand[0], versionCommand.slice(1), { encoding: 'utf8' }).trim();
  } catch {
    return null;
  }
}

function gitSha() {
  try {
    return execFileSync('git', ['rev-parse', 'HEAD'], { cwd: REPO_ROOT, encoding: 'utf8' }).trim();
  } catch {
    return null;
  }
}

/**
 * The runner copies the working tree, not the commit. A dirty tree means the recorded
 * SHA does not describe what actually ran, so the record has to say so.
 */
function workingTreeClean() {
  try {
    return execFileSync('git', ['status', '--porcelain'], { cwd: REPO_ROOT, encoding: 'utf8' }).trim() === '';
  } catch {
    return null;
  }
}

function installSkill(workspace, skillsAgentId) {
  const result = spawnSync(
    'npx',
    ['--yes', 'skills', 'add', REPO_ROOT, '-a', skillsAgentId, '-y', '--copy'],
    { cwd: workspace, encoding: 'utf8', stdio: 'pipe' },
  );
  if (result.status !== 0) {
    throw new Error(`Installing the skill for ${skillsAgentId} failed:\n${result.stderr || result.stdout}`);
  }
}

function runOne({ agentId, agent, mode, scenario, prompt, model, runDir, dryRun }) {
  const caseDir = join(runDir, agentId, mode, scenario);
  const workspace = join(caseDir, 'workspace');
  const command = buildCommand(agent, { prompt, workspace, model });

  if (dryRun) {
    console.log(`${agentId}/${mode}/${scenario}: ${command.map((part) => (part.includes(' ') ? JSON.stringify(part) : part)).join(' ')}`);
    return null;
  }

  mkdirSync(caseDir, { recursive: true });
  cpSync(join(FIXTURES_DIR, scenario, 'repo'), workspace, { recursive: true });
  if (mode === 'skill') installSkill(workspace, agent.skillsAgentId);

  const startedAt = new Date().toISOString();
  const result = spawnSync(command[0], command.slice(1), {
    cwd: workspace,
    encoding: 'utf8',
    stdio: 'pipe',
    timeout: INVOCATION_TIMEOUT_MS,
    killSignal: 'SIGKILL',
  });
  const finishedAt = new Date().toISOString();

  const generated = join(workspace, 'README.md');
  const produced = existsSync(generated);
  if (produced) cpSync(generated, join(caseDir, 'README.md'));

  writeFileSync(join(caseDir, 'meta.json'), `${JSON.stringify({
    agent: agentId,
    agentLabel: agent.label,
    agentVersion: toolVersion(agent.versionCommand),
    model: model ?? 'agent default',
    mode,
    scenario,
    prompt,
    command,
    skillCommit: gitSha(),
    skillCommitIsExact: workingTreeClean(),
    startedAt,
    finishedAt,
    exitCode: result.status,
    timedOut: result.signal === 'SIGKILL',
    producedReadme: produced,
  }, null, 2)}\n`);
  writeFileSync(join(caseDir, 'agent-output.txt'), `${result.stdout ?? ''}\n${result.stderr ?? ''}`);

  const outcome = result.signal === 'SIGKILL' ? `timed out after ${INVOCATION_TIMEOUT_MS / 60000} minutes` : `exit ${result.status}`;
  console.log(`${agentId}/${mode}/${scenario}: ${outcome}, README ${produced ? 'written' : 'MISSING'}`);
  return produced;
}

export function main(argv) {
  const args = parseArgs(argv);
  if (args.help) { console.log(HELP); return 0; }

  const { agents } = JSON.parse(readFileSync(join(EVALS_DIR, 'agents.json'), 'utf8'));
  const agentIds = args.agent === 'all' ? Object.keys(agents) : args.agent.split(',').map((id) => id.trim());
  for (const id of agentIds) if (!agents[id]) throw new Error(`Unknown agent: ${id}`);

  const modes = args.mode === 'both' ? MODES : [args.mode];
  for (const mode of modes) if (!MODES.includes(mode)) throw new Error(`Unknown mode: ${mode}`);

  const scenarios = listScenarios(args.scenario);
  const prompt = readPrompt();
  const runId = args.runId ?? new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const runDir = join(RESULTS_DIR, runId);

  if (!args.dryRun) {
    mkdirSync(runDir, { recursive: true });
    writeFileSync(join(runDir, 'run.json'), `${JSON.stringify({
      runId, startedAt: new Date().toISOString(), prompt, model: args.model ?? 'agent default',
      agents: agentIds, modes, scenarios, skillCommit: gitSha(), skillCommitIsExact: workingTreeClean(),
    }, null, 2)}\n`);
  }

  for (const agentId of agentIds) {
    for (const mode of modes) {
      for (const scenario of scenarios) {
        runOne({ agentId, agent: agents[agentId], mode, scenario, prompt, model: args.model, runDir, dryRun: args.dryRun });
      }
    }
  }

  console.log(args.dryRun
    ? `\nDry run: ${agentIds.length * modes.length * scenarios.length} agent invocations would run.`
    : `\nWrote ${runDir}. Score it with: node tests/evals/report.mjs ${runId}`);
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
