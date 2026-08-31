# Acme text helpers

[![MIT Licensed](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](LICENSE)

An npm workspace holding two ES module packages: `@acme/core`, the shared text
helpers, and `@acme/cli`, the `acme` command that runs them from a terminal.

## Requirements

- Node.js 20 or newer
- npm, for the workspace linking

## Installation

```text
npm install
```

This links `@acme/core` into `@acme/cli`, which depends on it.

## Quick start

```text
node packages/cli/bin/acme.js hello world
```

```text
Hello World
```

## Packages

| Package | Description |
| --- | --- |
| [`@acme/core`](packages/core/README.md) | `titleCase(text)`, the shared text helper |
| [`@acme/cli`](packages/cli/README.md) | The `acme` command, a front end for `@acme/core` |

Each package README covers installing that package on its own.

## Testing

```text
npm test
```

Runs both packages' tests from the workspace root with the Node.js test runner.

## License

MIT. See [LICENSE](LICENSE).
