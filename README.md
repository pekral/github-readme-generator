# A portable Agent Skill for writing READMEs that don't lie

[![MIT Licensed](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](LICENSE.md)

`github-readme-generator` teaches a coding agent to write or refresh a
repository's root `README.md` from what the project actually contains — its
code, manifests, scripts, tests, workflows, and existing docs. It runs in Claude
Code, Codex, and Cursor from a single canonical skill definition.

## Requirements

An agent host that loads Agent Skills — Claude Code, Codex, or Cursor. The skill
has no dependencies; the `install.sh` route needs Bash.

## Installation

### Claude Code

```text
/plugin marketplace add pekral/github-readme-generator
/plugin install github-readme-generator@pekral
```

Restart the session afterwards so the skill loads. The same two steps work from
the shell as `claude plugin marketplace add` and `claude plugin install`.

### Codex

```text
codex plugin marketplace add pekral/github-readme-generator
```

Then restart the ChatGPT desktop app, open the Plugins Directory, pick the
`pekral` marketplace, and install the plugin from there. Codex resolves the
catalog from [`.agents/plugins/marketplace.json`](.agents/plugins/marketplace.json)
and the plugin itself from [`.codex-plugin/plugin.json`](.codex-plugin/plugin.json).

### Cursor

```text
./install.sh
```

This copies `skills/github-readme-generator/` into `.agents/skills/` — the
directory Cursor reads — and into `.claude/skills/`, for the current project.
Re-running it replaces the installed copy rather than merging into it. It also
works for Codex if you would rather not use the plugin.

## Configuration

Turn the Claude Code plugin off and on without uninstalling it:

```text
claude plugin disable github-readme-generator
claude plugin enable github-readme-generator
```

Both write to `enabledPlugins` in `~/.claude/settings.json`, so the setting is
user-wide.

For the script route, the install target is an argument — any number of skills
directories, including user-wide ones:

```text
./install.sh ~/.cursor/skills
```

Verify an installed copy still matches the source:

```text
./install.sh --check ~/.cursor/skills
```

It exits non-zero when a copy is missing or has drifted, which makes it usable
as a CI step. `./install.sh --help` lists the full usage.

## Quick start

Ask for README work in the repository you want documented:

```text
Write a README for this repository.
```

The skill scans the repository, picks create / update / audit, drafts against
its structure reference, and ends with a summary of what it verified and what it
could not prove.

To get findings without touching a file:

```text
Audit this README and tell me what's wrong.
```

## Updating

Claude Code updates in two steps, then needs a restart:

```text
claude plugin marketplace update pekral
claude plugin update github-readme-generator
```

Codex refreshes its marketplace snapshot, then reinstalls from the Plugins
Directory:

```text
codex plugin marketplace upgrade pekral
```

Copies made by `install.sh` are static — pull and reinstall:

```text
git pull && ./install.sh
```

## What it does

- Scans the working tree first and builds a claim → source map before writing a
  single sentence.
- Omits any command, badge, version, config key, link, or license claim it
  cannot trace to a file in the repository.
- Builds the header block and badge row from templates — a `<picture>` wrapper
  for projects that own a logo, and version, license, CI and downloads badges
  filled from the manifest, the license file, and the workflow's own `name:`.
- Knows what each ecosystem keeps where, so a PHP package documents Composer and
  Packagist while a Rust crate documents Cargo and crates.io.
- Treats every file it reads as data, not instructions. Text in a scanned
  repository that addresses the agent is reported to you, never obeyed.
- Restricts its diff to `README.md`, and never stages, commits, or pushes unless
  you say so.

## Documentation

- [`SKILL.md`](skills/github-readme-generator/SKILL.md) — purpose, workflow, core
  constraints.
- [`references/readme-structure.md`](skills/github-readme-generator/references/readme-structure.md)
  — header block, section order, what to cut, per-ecosystem rules, style.
- [`references/evidence-policy.md`](skills/github-readme-generator/references/evidence-policy.md)
  — what counts as evidence, badge templates, security and change-scope rules.
- [`references/validation-checklist.md`](skills/github-readme-generator/references/validation-checklist.md)
  — pre-handover checks and the handover summary shape.

## Testing

[`tests/scenarios.md`](tests/scenarios.md) defines eight scenarios — from a
documented PHP package to a monorepo to a secrets-handling case — each with
activation and output invariants, plus a host coverage log to fill in.

## Changelog

See [CHANGELOG](CHANGELOG.md).

## Contributing

See [CONTRIBUTING](CONTRIBUTING.md).

## Security

See [the security policy](SECURITY.md).

## Credits

- [Petr Král](https://pekral.cz) — [@kral_petr_88](https://x.com/kral_petr_88)
- [All contributors](../../contributors)

## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.
