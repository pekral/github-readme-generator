# Changelog

All notable changes to `github-readme-generator` are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 1.0.0-beta.1 - 2026-09-02

First tagged release, published as a public beta. The manifests carried a
`1.0.0` from 2026-08-23 that was never tagged and never released; this section
supersedes it and describes what the beta actually contains.

Beta because two things are not finished. The skill is exercised against Claude
Code only — the other hosts it installs into are packaged, not tested. And the
benchmark that would measure whether the skill helps is not yet trustworthy: its
scorer mistakes command output for commands and a logo for a badge
([#11](https://github.com/pekral/github-readme-generator/issues/11)), so no
number from it is published as evidence.

### Added

- The canonical skill in `skills/github-readme-generator/`, with `SKILL.md` and
  three on-demand references: structure, evidence policy, and validation
  checklist.
- Evidence-first workflow — scan the repository, map every claim to a source,
  and omit anything that cannot be traced to a file.
- Three modes: create a README, update one while preserving valid branding and
  hand-written prose, or audit without writing.
- Header block guidance for both cases: a `<picture>` wrapper with light/dark
  assets and an explicit `<h1>` for projects that own a logo, a plain Markdown
  heading for those that do not.
- Badge templates for package version, license, CI, and downloads, each with the
  evidence it requires.
- Per-ecosystem rules for PHP, Node, Python, Rust, and Go, covering where each
  keeps its manifest, install command, test command, and registry.
- A fixed reader path — Requirements, Installation, Configuration, Quick start —
  so nobody scrolls back to install the thing.
- Ten test scenarios in `tests/scenarios.md`, each with activation and output
  invariants, among them a workflow that cannot run on the default branch and a
  manifest description the repository contradicts.
- Distribution through `npx skills add pekral/github-readme-generator`, which
  covers Claude Code, Codex, Cursor, and every other agent the `skills` CLI
  knows, and brings `list`, `update`, and `remove` with it. Both plugin hosts
  also carry a marketplace entry: `.claude-plugin/` for Claude Code, and
  `.codex-plugin/plugin.json` with a repo marketplace at
  `.agents/plugins/marketplace.json` for Codex.
- `skills/github-readme-generator/LICENSE.md` — a copy of the root notice, so an
  installed copy stays licensed even though installers take that directory alone.
- A skill description that keys off what a user actually types — "write a
  README", "update the README", "audit this README" — rather than off project
  state. In testing, wording that described when a project *needs* a README left
  the agent free to write one itself without ever invoking the skill.
- `CODE_OF_CONDUCT.md` (Contributor Covenant 2.1), plus bug report, feature
  request, and pull request templates under `.github/`.
- `.gitignore` for the local skill copies an installer writes.

- `tests/repository.test.mjs` — the repository checked against its own claims:
  the files the skill declares, its licence copy matching the root one, every
  relative documentation link resolving, a host coverage row per test scenario, a
  repository and a ground truth per benchmark fixture, and one version agreed by
  the three manifests, the changelog and the git tags. It runs in CI, so a broken
  local link or a manifest that drifts out of step fails the build.

- `docs/examples/` — three before/after README pairs (Composer library,
  unpublished CLI, stale README), each carrying the full text of both outputs,
  the provenance of the run that produced them, and a comparison of what actually
  differs. The index reports the headline finding rather than burying it: across
  the ten repositories recorded, the baseline agent invented nothing, and in one
  pair the skill did worse than the baseline by discarding hand-written prose its
  own rules tell it to keep.

- Cross-agent evaluation benchmark in `tests/evals/`. The same plain prompt runs
  against ten fixture repositories — PHP, Laravel, Node, CLI, monorepo, an app
  with environment configuration, a stale README, a repository with no manifest,
  one with incomplete docs, and one carrying adversarial instructions — twice per
  agent, with and without the skill. The harness carries invocation templates
  for Claude Code, Codex and Cursor; only Claude Code has been run.
- A deterministic scorer that needs no network and no model: it counts
  unsupported claims, invalid commands, invalid badges, broken links, and missing
  information against each fixture's ground truth, and reports a hallucination
  rate per README. Generation and scoring are separate programs, so a recorded
  run can be rescored without paying for generation again. The scorer has known
  defects — it reads command output as commands and a logo as a badge
  ([#11](https://github.com/pekral/github-readme-generator/issues/11)) — so no
  figure it produces is published as evidence yet.
- `node --test tests/evals/*.test.mjs` — crafted READMEs with known defects,
  plus a sweep that fails when a fixture's ground truth drifts from its own
  repository.
- One recorded run, `2026-08-31-claude-code-subset`: Claude Code, both modes,
  two of the ten scenarios, zero findings on each. It shows the harness works;
  it is far too small to say anything about the skill, and the README says so.
- A `Tests` workflow running the scorer, the ground-truth sweep, and the
  licence-copy check on Node.js 20 and 22, for every push to `master` and every
  pull request. The repository had no CI before this.

- Badge liveness. A CI badge is emitted only when the workflow's triggers put
  runs on the default branch — the branch a badge reports on. A `pull_request`-only
  workflow, a `workflow_dispatch`-only workflow, and a workflow file left outside
  `.github/workflows/` therefore get no badge, while a scheduled workflow keeps
  one. The omission is named in the handover summary.
- Manifest claim check. The manifest `description` is read as a claim as well as
  evidence: when it names a capability the repository does not contain, the
  contradiction is reported with both sources. The manifest itself stays
  unmodified.
- Public surface findings in audit mode — empty About description, homepage or
  topics with a proposed description and topic candidates traced to sources
  already read, missing community health files, and README links with no target.
  Reported as text; nothing is written and no repository setting is applied.
