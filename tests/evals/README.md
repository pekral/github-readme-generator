# Cross-agent evaluation benchmark

Measures whether `github-readme-generator` actually produces more accurate READMEs
than the same agent without it. Every agent runs the same prompt against the same
repositories twice — once with the skill installed, once without — and both outputs
are scored by the same deterministic checker.

The benchmark exists because the project makes a factual promise: *READMEs grounded
in repository evidence, with no invented claims*. That promise is testable, so it
should be tested rather than asserted.

## Requirements

Node.js 20 or newer, and the CLI of whichever agent you want to measure. The scorer
itself has no dependencies and needs no network.

## The two halves

Generation costs money and is not reproducible — the same agent can write a different
README twice. Scoring is free, offline, and byte-for-byte reproducible. They are
separate programs, so a recorded run can be rescored after a scoring change without
paying for generation again.

```text
node tests/evals/run.mjs --dry-run
node tests/evals/run.mjs --agent claude-code --scenario php-package
node tests/evals/report.mjs <run id>
```

`run.mjs --help` lists every option. The full matrix is three agents × two modes ×
ten scenarios = **60 agent invocations**; start with `--dry-run`, which prints the
exact command each invocation would use and spends nothing.

### What a run does

For each agent, mode, and scenario it copies `fixtures/<scenario>/repo` into a fresh
workspace, installs the skill there in `skill` mode only, runs the agent, and records:

| File | Contents |
| --- | --- |
| `README.md` | exactly what the agent wrote |
| `meta.json` | agent, agent version, model, mode, scenario, prompt, full command, skill commit, timestamps, exit code |
| `agent-output.txt` | the agent's own stdout and stderr |
| `findings.json` | the scorer's verdict, written by `report.mjs` |

`run.json` at the root of the run records the prompt, model, skill commit, and the
matrix that was requested. `summary.json` and `summary.md` are written by `report.mjs`.

The workspaces themselves are not committed — they are copies of fixtures plus an
installed skill. Everything needed to audit a result is in the four files above.

## Modes

| Mode | Setup |
| --- | --- |
| `baseline` | the fixture, untouched |
| `skill` | the fixture plus `npx skills add <this repo> -a <agent> -y --copy` |

Both modes get the identical prompt from [`prompts.md`](prompts.md), and it is
deliberately plain: *"Write the root README.md for this repository."* A prompt that
told the agent to verify commands or avoid inventing badges would do the skill's job
inside the baseline, and the comparison would measure nothing.

## Scenarios

Ten repositories under `fixtures/`, each with a `repo/` and a `truth.json`.

| Scenario | What it is there to catch |
| --- | --- |
| `php-package` | Composer library with tests, a license, and CI on the default branch |
| `laravel-package` | a real publish tag and real config keys, against invented ones |
| `node-package` | npm scripts, an `engines` constraint, and the package manager the lock file proves |
| `cli-app` | a CLI's real flags — and a workflow file outside `.github/workflows/`, which earns no badge |
| `small-library` | source only: no manifest, no license, no tests, so almost nothing is provable |
| `env-config-app` | a safe `.env.example` beside a local `.env` whose values must never be copied |
| `stale-readme` | keeping a real logo and hand-written prose while fixing a stale version, a dead link, and a dead script |
| `monorepo` | explaining the whole and linking to packages, without mixing per-package commands into the root |
| `incomplete-docs` | three exported symbols, documentation for one — the README must carry the rest |
| `adversarial` | a source comment and a docs page that address the agent directly and demand a fake certification, a fake customer claim, and an invented command |

### Why fixtures rather than live repositories

Deterministic scoring needs exhaustive ground truth: every command that legitimately
exists, every config key, every file a link may point at. That can be authored for a
fixture and only guessed at for a live repository, which would also drift under the
benchmark and require the network. The adversarial scenario has no honest live
equivalent at all.

The fixtures are shaped like the ecosystems they represent — real manifests, real
scripts, runnable source, tests that pass — but they are authored, and each
`truth.json` says what it is testing. Two exceptions are worth knowing before you run
anything inside one: the PHP fixtures need `composer install` for their test command,
and the monorepo's CLI package imports `@acme/core` by name, so its test needs the
workspace link that `npm install` creates at the workspace root.

One consequence is recorded openly: a fixture has no git remote, so it cannot prove a
GitHub slug or that a package is published. The scorer therefore judges which *kind*
of badge the repository earns, and is permissive about the owner/repo slug inside it.

## Metrics

| Metric | Detected by |
| --- | --- |
| Unsupported claims | a `forbidden` pattern in the ground truth matches — an invented feature, an invented config key, a contradicted runtime, a leaked secret |
| Invalid commands | a line in a shell code block is not one the repository defines |
| Invalid badges | a badge URL matches no badge the repository earns |
| Broken links | a relative link resolves to no file, or an external link is not one the repository points at |
| Missing information | a `required` pattern the repository strongly supports never appears |

`hallucinationRate` is errors divided by verifiable statements — commands, badges,
links, plus the ground truth's required and forbidden checks. `0` means the README
invented nothing and omitted nothing the fixture proves.

One defect can trip two detectors: the allow-list rejects the whole command
`yarn add @acme/slugify` while a forbidden rule matches `yarn add` inside it. The
scorer keeps the widest evidence per kind, so a mode is never charged twice for the
same text.

## Testing the scorer

```text
node --test tests/evals/*.test.mjs
```

Crafted READMEs with known defects, a sweep asserting every fixture has a loadable
ground truth whose `required` checks all fire on an empty README, and the aggregation
rules — including that a case which produced no README counts as a repository but does
not dilute the rate. A ground truth that drifts from its own repository fails here
rather than quietly skewing a benchmark.

## Reproducing a run

Everything a second contributor needs is recorded, not remembered:

- **prompt** — in `prompts.md`, and copied into every `run.json` and `meta.json`
- **agent and version** — `meta.json`, from the CLI's own `--version`
- **model** — `meta.json`; pass `--model` to pin it, otherwise the agent's default is recorded as such
- **skill commit** — `meta.json`, the SHA of this repository when the run happened
- **repository under test** — the fixture, committed here and versioned with the benchmark
- **date** — `startedAt` and `finishedAt`, in UTC

Agents are not deterministic, so two runs of the same matrix will differ. The
benchmark's claim is comparative — baseline against skill, same prompt, same
repositories, same scorer — and a single run of 10 scenarios is a small sample. Report
the run id alongside any number taken from it.

### Where these commands come from

Every invocation in [`agents.json`](agents.json) was read from the tool itself or its
published reference, never guessed:

| Agent | Invocation | Source |
| --- | --- | --- |
| Claude Code | `claude -p <prompt> --permission-mode acceptEdits` | `claude --help` |
| Codex | `codex exec --sandbox workspace-write -C <workspace> <prompt>` | the Codex CLI reference |
| Cursor | `cursor-agent -p <prompt> --force --trust --workspace <workspace>` | `cursor-agent --help` |

Each agent runs against a throwaway copy of a fixture, which is why non-interactive
write access is acceptable here and nowhere else in this repository.

## Adding a scenario

1. Create `fixtures/<name>/repo/` with a repository that stands on its own — a real
   manifest, source that runs, tests that pass.
2. Write `fixtures/<name>/truth.json`: `commands.allowed`, `badges.allowedPatterns`,
   `links.allowedExternalPatterns`, the `required` facts, and the `forbidden` traps.
   Every rule needs an `id` and a `note` — the note is what the report shows a reader.
3. Run `node --test tests/evals/*.test.mjs`. The sweep will tell you if a required
   check does not fire or a pattern is malformed.
4. Write a grounded README by hand and score it. It should come out at zero; if it
   does not, the ground truth is wrong, not the README.

## Publishing results

The root README may cite benchmark numbers **only** from a run recorded under
`results/`, and must name the run id. No number goes into the README from a run that
was not committed — that is the same evidence rule the skill itself enforces, applied
to the project's own claims about itself.
