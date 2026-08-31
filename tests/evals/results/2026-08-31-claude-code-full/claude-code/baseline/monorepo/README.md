# acme-workspace

An npm workspaces monorepo containing a shared text helper and the command-line
tool built on top of it.

| Package | Description |
| --- | --- |
| [`@acme/core`](packages/core/README.md) | Text helpers shared by every package in the workspace. |
| [`@acme/cli`](packages/cli/README.md) | The `acme` command-line front end for `@acme/core`. |

The workspace root is private and is not published; the two packages under
`packages/` are the publishable units.

## Requirements

- Node.js 20 or newer (`engines.node: ">=20"`)
- npm, for its workspaces support

Both packages are ESM (`"type": "module"`) and have no runtime dependencies
outside the workspace — `@acme/cli` depends only on `@acme/core`.

## Installation

From the repository root:

```bash
npm install
```

This installs both workspaces and links `@acme/cli` against the local
`@acme/core`, so the CLI runs against the source in this checkout.

## Quick start

Run the CLI through the workspace:

```bash
npx acme hello world
```

```text
Hello World
```

The CLI joins its arguments with spaces, title-cases the result and writes it to
standard output.

Use the helper directly from a package in the workspace:

```js
import { titleCase } from '@acme/core';

titleCase('hello world'); // 'Hello World'
```

## API

### `titleCase(text)`

Returns `text` with the first letter of every word uppercased. Only lowercase
letters at a word boundary are changed, so letters that are already uppercase
are left untouched.

```js
titleCase('acme cli'); // 'Acme Cli'
```

## Testing

Tests use the Node.js built-in test runner, so no test dependency is installed.

Run every package's tests from the root:

```bash
npm test
```

Run a single package:

```bash
npm test --workspace @acme/core
npm test --workspace @acme/cli
```

## Project layout

```text
packages/
  core/
    src/index.js        # titleCase
    test/core.test.js
  cli/
    bin/acme.js         # acme executable
    test/cli.test.js
```

## License

Released under the MIT License — see [LICENSE](LICENSE). Copyright (c) 2026 Acme.
