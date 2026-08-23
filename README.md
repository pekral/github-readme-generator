# A portable Agent Skill for writing READMEs that don't lie

[![MIT Licensed](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](LICENSE.md)

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

An agent host that loads Agent Skills — Claude Code, Codex, or Cursor. The skill
itself has no dependencies; the `install.sh` route needs Bash.

## Installation

### Claude Code — plugin marketplace

```text
/plugin marketplace add pekral/github-readme-generator
/plugin install github-readme-generator@pekral
```

The same two steps work from the shell as `claude plugin marketplace add` and
`claude plugin install`. Restart the session afterwards so the skill loads. This
route needs nothing else — do not also run `install.sh` for Claude Code, or the
skill ends up loaded twice.

### Codex and Cursor — skills directory

Both read Agent Skills from a skills directory, so installing means copying
`skills/github-readme-generator/` into one. The bundled script does that, and is
safe to re-run — it replaces the installed copy rather than merging into it:

```text
./install.sh
```

That writes into `.agents/skills/` for the current project, which is the
directory Codex and Cursor both read, plus `.claude/skills/`.

Pass one or more directories to install elsewhere — a user-wide Cursor install,
for example:

```text
./install.sh ~/.cursor/skills
```

To confirm an installed copy still matches the canonical source:

```text
./install.sh --check ~/.cursor/skills
```

It exits non-zero when a copy is missing or has drifted, so it works as a CI
step. Run `./install.sh --help` for the full usage. Copying the directory by
hand works just as well; the skill has no build step.

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

`install.sh --check` doubles as an installation test; see Installation above.

## Credits

- [Petr Král](https://pekral.cz) — [@kral_petr_88](https://x.com/kral_petr_88)
- [All contributors](../../contributors)

## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.
