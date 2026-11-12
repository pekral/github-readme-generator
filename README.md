<div align="left">
    <picture>
        <img src="logo.svg" alt="GitHub README Generator: a document checked against repository sources" width="720">
    </picture>

<h1>github-readme-generator</h1>

[![Latest release](https://img.shields.io/github/v/release/pekral/github-readme-generator?style=flat-square)](https://github.com/pekral/github-readme-generator/releases)
[![MIT Licensed](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](LICENSE.md)
![Tests](https://github.com/pekral/github-readme-generator/workflows/Tests/badge.svg)

</div>

An Agent Skill for coding agents that creates, updates, or audits a repository's
root `README.md` using its code, manifests, scripts, tests, workflows, and docs.
It has been developed and tested with Claude Code; packages for Codex, Cursor,
and other hosts supported by the `skills` CLI are available but have not been
verified.

## Requirements

An agent host that loads Agent Skills. The skill itself has no dependencies;
installing with `npx` needs Node.js.

## Installation

```text
npx skills add pekral/github-readme-generator
```

The CLI supports Claude Code, Codex, Cursor, and other agent hosts. Use `-g`
to install for your user instead of the current project, and `-a` to select
hosts explicitly:

```text
npx skills add pekral/github-readme-generator -g -a claude-code -a codex
```

### Plugin installation

Claude Code and Codex also have marketplace entries for plugin installation
and updates.

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

The skill has no settings; once installed, it activates on README requests.
`npx skills list` shows what is installed and where, and
`claude plugin disable github-readme-generator` (or `enable`) turns the Claude
Code plugin off and on user-wide, through `enabledPlugins` in
`~/.claude/settings.json`.

## Quick start

Ask for README work in the repository you want documented:

```text
Write a README for this repository.
```

This creates or edits `README.md` and may create pages under `docs/` for long
catalogue sections. Review the resulting diff; existing documentation pages
are never overwritten.

The agent scans the repository before writing and reports what it verified
and what it could not prove. It never stages, commits, or pushes unless you ask.

To get findings without touching a file:

```text
Audit this README and tell me what's wrong.
```

An audit reports broken links, missing community health files, and empty
GitHub About fields when repository metadata is available. It proposes fixes
without changing files or repository settings.

## What it does

- Maps each README claim to a source in the working tree before writing.
- Omits any command, badge, version, config key, link, or license claim it
  cannot trace to a file in the repository.
- Builds the header and up to four badges (version, license, CI, downloads)
  from manifests, the license file, and the workflow's `name:`. A workflow that
  never runs on the default branch gets no badge.
- Knows what each ecosystem keeps where, so a PHP package documents Composer and
  Packagist while a Rust crate documents Cargo and crates.io.
- Reports instructions embedded in scanned files without following them.
- Moves oversized catalogue sections to new pages under `docs/`, leaving a
  short summary and link. The [split rules](skills/github-readme-generator/references/section-split.md)
  define the thresholds, exemptions, page structure, and permitted changes.

## Documentation

- [`SKILL.md`](skills/github-readme-generator/SKILL.md): purpose, workflow, core
  constraints.
- [`references/readme-structure.md`](skills/github-readme-generator/references/readme-structure.md)
  covers the header, section order, per-ecosystem rules, and style.
- [`references/evidence-policy.md`](skills/github-readme-generator/references/evidence-policy.md)
  covers evidence, badge templates, public surface findings, security
  and change-scope rules.
- [`references/validation-checklist.md`](skills/github-readme-generator/references/validation-checklist.md)
  lists pre-handover checks and the handover summary requirements.
- [`docs/examples/`](docs/examples/README.md): three README pairs written by the
  same agent with and without the skill: a Composer library, an unpublished CLI,
  and a README that had drifted from its package. On those repositories the
  baseline invented nothing, and in one case the skill did worse; the index says
  so plainly.

## Testing

```text
node --test tests/repository.test.mjs
node --test tests/evals/*.test.mjs
```

Both need Node.js 20 or newer and run without network access. CI runs them on
Node.js 20 and 22. The first checks shipped skill files, the licence copy,
relative documentation links, scenario coverage rows, and version consistency
across manifests, changelog, and tags. The second checks the benchmark scorer
and every fixture's ground truth.

Eleven manual scenarios are defined in [`tests/scenarios.md`](tests/scenarios.md);
their Claude Code coverage log is empty. The with/without-skill benchmark in
[`tests/evals/`](tests/evals/README.md) also has known scoring errors: it reads
help text and command output as commands, and a repository's logo as a badge.
Its scores cannot establish whether the skill improves README accuracy.
[#11](https://github.com/pekral/github-readme-generator/issues/11) recorded
those defects and was closed as not planned; the defects remain. The one
published run,
[`2026-08-31-claude-code-subset`](tests/evals/results/2026-08-31-claude-code-subset/summary.md),
shows only that the harness works end to end.

## Upgrading

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

See [CONTRIBUTING](CONTRIBUTING.md), and the
[Code of Conduct](CODE_OF_CONDUCT.md) that participation is held to.

## Security

See [the security policy](SECURITY.md).

## Credits

- [Petr Král](https://pekral.cz), [@kral_petr_88](https://x.com/kral_petr_88)
- [All contributors](../../contributors)

## License

The MIT License (MIT). See [License File](LICENSE.md). The skill directory
carries [its own copy](skills/github-readme-generator/LICENSE.md) of the notice,
so an installed copy stays licensed even though installers take that directory
alone.
