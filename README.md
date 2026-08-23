# A portable Agent Skill for writing READMEs that don't lie

`github-readme-generator` teaches a coding agent to write or refresh a
repository's root `README.md` from what the project actually contains — its
code, manifests, scripts, tests, workflows, and existing docs — instead of from
plausible-sounding guesses. It works in Codex, Claude Code, and Cursor from a
single canonical skill definition.

## What it does

- Scans the working tree first and builds a claim → source map before writing a
  single sentence.
- Omits any command, badge, version, config key, link, or license claim it
  cannot trace to a file in the repository.
- Builds the header block for you: a `<picture>` wrapper with light/dark assets
  and an explicit `<h1>` when the project owns a logo, a plain Markdown heading
  when it does not.
- Assembles the badge row from templates — package version, license, CI,
  downloads — filling the slug from the manifest, the SPDX identifier from the
  license file, and the workflow path from the workflow's own `name:`.
- Knows what each ecosystem keeps where, so a PHP package documents Composer and
  Packagist while a Rust crate documents Cargo and crates.io.
- Derives the quick start from the call the package exists to make, then grows
  the same API across a couple of examples instead of listing unrelated features.
- Emits sections conditionally, so the result has no empty headings and no
  `TODO` placeholders unless you ask for a skeleton.
- Supports three modes: create a new README, update an existing one while
  preserving valid branding and hand-written prose, or audit without writing.
- Restricts its diff to `README.md`, and never stages, commits, or pushes unless
  you say so.

## Requirements

An agent host that loads Agent Skills — Codex, Claude Code, or Cursor. The skill
itself has no dependencies; `install.sh` needs Bash.

## Installation

The canonical skill lives in `skills/github-readme-generator/`. Installing means
copying that directory into a skills directory your host reads.

Install into the current project, for both `.agents/skills` (Codex, Cursor) and
`.claude/skills` (Claude Code):

```text
./install.sh
```

Install into a different skills directory — for example user-wide Claude Code:

```text
./install.sh ~/.claude/skills
```

Copying the directory by hand works just as well; the skill has no build step.

## Quick start

Once installed, ask your agent for README work in the project you want
documented:

```text
Write a README for this repository.
```

The agent scans the repository, decides between create / update / audit, drafts
against the structure reference, and finishes with a handover summary listing
what it verified and what it could not prove.

To get findings without touching a file, ask for an audit instead:

```text
Audit this README and tell me what's wrong.
```

## Documentation

The skill keeps its detail in references that load on demand:

- [`SKILL.md`](skills/github-readme-generator/SKILL.md) — purpose, workflow, and
  core constraints.
- [`references/readme-structure.md`](skills/github-readme-generator/references/readme-structure.md)
  — header block, section order, adaptive template, per-ecosystem rules, keeping
  examples true to the package's own domain, and style.
- [`references/evidence-policy.md`](skills/github-readme-generator/references/evidence-policy.md)
  — what counts as evidence, the badge templates and the proof each one needs,
  plus security and change-scope rules.
- [`references/validation-checklist.md`](skills/github-readme-generator/references/validation-checklist.md)
  — pre-handover checks and the handover summary shape.

## Testing

[`tests/scenarios.md`](tests/scenarios.md) defines eight scenarios — from a
documented PHP package to a monorepo to a secrets-handling case — each with
activation and output invariants, plus a host coverage log to fill in.

To verify an installed copy still matches the canonical source:

```text
./install.sh --check .claude/skills
```
