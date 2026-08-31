# Changelog

All notable changes to `github-readme-generator` are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

### Added

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
- Two test scenarios: a workflow that cannot run on the default branch, and a
  manifest description the repository contradicts.
- Codex plugin packaging — `.codex-plugin/plugin.json` and a repo marketplace at
  `.agents/plugins/marketplace.json`, installable with
  `codex plugin marketplace add pekral/github-readme-generator`.
- `.gitignore` for the local skill copies an installer writes.

### Changed

- The skill description now keys off what a user actually types — "write a
  README", "update the README", "audit this README" — instead of describing when
  a project needs one. In testing, the previous wording left the agent free to
  write the README itself without ever invoking the skill.

### Fixed

- Installed copies now carry the MIT notice. Installers copy only
  `skills/github-readme-generator/`, which had no license file, so a copy did not
  meet the one condition MIT sets.
- `.codex-plugin/plugin.json` now declares `license`, `author`, `homepage`,
  `repository`, and `keywords`, matching the Claude Code manifest.

### Removed

- `install.sh`. Installing is now `npx skills add pekral/github-readme-generator`,
  which covers Claude Code, Codex, Cursor, and every other agent the `skills` CLI
  knows, and brings `list`, `update`, and `remove` with it.

## 1.0.0 - 2026-08-23

First release.

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
- Distribution as a Claude Code plugin through the `pekral` marketplace, plus
  `install.sh` for Codex and Cursor with a `--check` mode for CI.
- Eight test scenarios in `tests/scenarios.md`, each with activation and output
  invariants.
