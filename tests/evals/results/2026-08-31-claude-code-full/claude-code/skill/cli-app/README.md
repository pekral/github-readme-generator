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
