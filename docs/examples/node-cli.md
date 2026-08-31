# Node CLI: an unpublished command-line tool

A CLI that is on no registry, whose only workflow file sits outside `.github/workflows/` and therefore never runs. Two traps: an install command that cannot be `npm install -g <name>`, and a CI badge that would render blank forever.

## Context

| | |
| --- | --- |
| Repository under test | [`tests/evals/fixtures/cli-app/repo`](../../tests/evals/fixtures/cli-app/repo) |
| Ecosystem | Node.js, npm, node:test |
| Skill commit | `d7cfae8` — `skills/` was byte-identical at every commit the run spanned |
| Agent | Claude Code 2.1.251, default model |
| Prompt | `Write the root README.md for this repository.` — identical in both modes |
| Recorded | 2026-08-31 (91 s baseline, 125 s with the skill) |
| Raw run | `2026-08-31-claude-code-full`, on branch `publish-benchmark-results` |

## What the repository actually proves

- `package.json` names `@acme/slugify-cli`, maps `bin.slugify` to `./bin/slugify.js`, requires Node `>=20`, and defines `scripts.test` as `node --test`. The package is **not published**.
- `bin/slugify.js` implements exactly three options — `--sep <char>`, `--upper`, and `-h` / `--help` — and joins remaining arguments with a space.
- `test/cli.test.js` covers the help output, the default separator, and `--sep`.
- `.github/pr-checks.yml` sits **outside** `.github/workflows/`, so GitHub never runs it.

## Baseline — the same agent, no skill

````markdown
# @acme/slugify-cli

Slugify text from the command line.

Turns arbitrary text into a URL-safe slug: lowercase, every run of non-alphanumeric
characters collapsed into a separator, and leading and trailing separators removed.

## Requirements

- Node.js >= 20

No runtime dependencies.

## Installation

From a checkout of this repository:

```bash
npm install -g .
```

This puts the `slugify` command on your `PATH`. Without installing, run the entry
point directly:

```bash
node bin/slugify.js "Hello, World!"
```

## Usage

```
Usage: slugify [options] <text>

Options:
  --sep <char>   Separator between words (default: -)
  --upper        Emit the slug in upper case
  -h, --help     Show this help
```

Running `slugify` with no arguments prints the same help text.

Several arguments are joined with spaces before slugifying, so quoting the text is
optional:

```bash
slugify My Blog Post 2026
# my-blog-post-2026
```

## Examples

```bash
slugify "Hello, World!"
# hello-world

slugify --sep _ "Hello, World!"
# hello_world

slugify --upper "Hello, World!"
# HELLO-WORLD
```

## Tests

```bash
npm test
```

Runs the Node.js built-in test runner (`node --test`) over `test/`.

## License

MIT — see [LICENSE](LICENSE).
````

## With `github-readme-generator`

````markdown
# Slugify text from the command line

[![MIT Licensed](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](LICENSE)

`slugify` turns arbitrary text into a URL-safe slug. It lowercases the input,
replaces every run of non-alphanumeric characters with a separator, and trims
separators from both ends. No runtime dependencies.

## Requirements

- Node.js 20 or newer

## Installation

From a checkout of this repository:

```text
npm install -g .
```

This puts the `slugify` command on your `PATH`. Without installing, run the
entry point directly with `node bin/slugify.js`.

## Quick start

```text
$ slugify "Hello, World!"
hello-world
```

Choose a different separator with `--sep`:

```text
$ slugify --sep _ "Hello, World!"
hello_world
```

Uppercase the finished slug with `--upper`:

```text
$ slugify --upper "Hello, World!"
HELLO-WORLD
```

Remaining arguments are joined with a space before slugification, so quoting is
optional:

```text
$ slugify Release notes 2026
release-notes-2026
```

Run `slugify --help` for the full option list.

## Testing

```text
npm test
```

## License

MIT. See [LICENSE](LICENSE).
````

## What differs

### Both got right

**Neither emitted a CI badge.** `.github/pr-checks.yml` looks like a workflow and is not one, and a badge for it would have rendered blank forever. Both agents left it alone.

**Neither invented an install command.** The package is unpublished, so `npm install -g @acme/slugify-cli` would fail. Both wrote `npm install -g .` and said it installs from a checkout — the only command that actually works.

**Neither invented a flag.** Both documented `--sep` and `--upper` and nothing else. No `--watch`, no `--json`, no `--output`.

### Where the skill went further

**It referenced the help output instead of transcribing it.** The baseline pasted the full `Usage:` / `Options:` block into the README, which is a second copy of `bin/slugify.js` that will drift from it. The skill showed three worked invocations and ended with *"Run `slugify --help` for the full option list."*

**It showed input and output together**, as `$ slugify "Hello, World!"` followed by `hello-world`, rather than a command block and a commented result.

**A licence badge**, again backed by `LICENSE` and the manifest's `license` field.

### Where the baseline went further

Nothing factual. Its extra content — the transcribed help text and a separate `Examples` section — is duplication rather than information.

### Verdict

No factual difference; both avoided both traps. The skill's output is the one that stays true as the CLI changes, because it points at the help output rather than copying it.
