# A portable Agent Skill for writing READMEs that don't lie

[![MIT Licensed](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](LICENSE.md)

`github-readme-generator` teaches a coding agent to write or refresh a
repository's root `README.md` from what the project actually contains — its
code, manifests, scripts, tests, workflows, and existing docs. One canonical
skill definition serves every host; Claude Code, Codex, and Cursor are the three
it is packaged and tested against.

## Requirements

An agent host that loads Agent Skills. The skill itself has no dependencies;
installing with `npx` needs Node.js.

## Installation

```text
npx skills add pekral/github-readme-generator
```

That installs into every agent it detects — Claude Code, Codex, Cursor, and
[70-odd others](https://github.com/vercel-labs/skills#supported-agents). Add
`-g` to install for your user instead of the current project, and `-a` to pick
agents explicitly:

```text
npx skills add pekral/github-readme-generator -g -a claude-code -a codex
```

### As a plugin instead

Both plugin hosts carry a marketplace entry, which trades a second command for
managed updates.

Claude Code:

```text
/plugin marketplace add pekral/github-readme-generator
/plugin install github-readme-generator@pekral
```

Codex:

```text
codex plugin marketplace add pekral/github-readme-generator
```

Codex then needs a restart of the ChatGPT desktop app, after which the plugin
appears in the Plugins Directory under the `pekral` marketplace.

## Configuration

List what is installed, and where:

```text
npx skills list
```

Turn the Claude Code plugin off without uninstalling it:

```text
claude plugin disable github-readme-generator
claude plugin enable github-readme-generator
```

Both write to `enabledPlugins` in `~/.claude/settings.json`, so the setting is
user-wide.

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

An audit also covers the surfaces beside the README — an empty GitHub About box,
missing community health files, links with no target — as text for you to apply.

## What it does

- Scans the working tree first and builds a claim → source map before writing a
  single sentence.
- Omits any command, badge, version, config key, link, or license claim it
  cannot trace to a file in the repository.
- Builds the header block and badge row from templates — a `<picture>` wrapper
  for projects that own a logo, and version, license, CI and downloads badges
  filled from the manifest, the license file, and the workflow's own `name:`. A
  workflow that cannot run on the default branch gets no badge, so none ships
  permanently blank.
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
  — header block, section order, what to cut, per-ecosystem rules, keeping
  examples true to the package's own domain, and style.
- [`references/evidence-policy.md`](skills/github-readme-generator/references/evidence-policy.md)
  — what counts as evidence, badge templates, public surface findings, security
  and change-scope rules.
- [`references/validation-checklist.md`](skills/github-readme-generator/references/validation-checklist.md)
  — pre-handover checks and the handover summary shape.

## Testing

[`tests/scenarios.md`](tests/scenarios.md) defines ten scenarios — from a
documented PHP package to a monorepo to a secrets-handling case — each with
activation and output invariants, plus a host coverage log to fill in.

## Updating

```text
npx skills update github-readme-generator
```

Plugin installs update through their own host instead:

```text
claude plugin marketplace update pekral && claude plugin update github-readme-generator
codex plugin marketplace upgrade pekral
```

Claude Code needs a session restart afterwards.

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

The MIT License (MIT). Please see [License File](LICENSE.md) for more
information. The skill directory carries
[its own copy](skills/github-readme-generator/LICENSE.md) of the notice, so an
installed copy stays licensed even though installers take that directory alone.
