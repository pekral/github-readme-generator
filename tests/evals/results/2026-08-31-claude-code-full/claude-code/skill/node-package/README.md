# @acme/slugify

Turns arbitrary text into URL-safe slugs.

A single dependency-free function: it folds accents away, lowercases, and
collapses everything that is not `a-z0-9` into a separator — so
`"Hello, World!"` becomes `hello-world`.

## Requirements

- Node.js >= 20
- No runtime dependencies

## Installation

```bash
npm install @acme/slugify
```

## Quick start

The package is ESM-only (`"type": "module"`) and exposes a single named export:

```js
import { slugify } from '@acme/slugify';

slugify('Hello, World!');
// 'hello-world'

slugify('Hello, World!', { separator: '_' });
// 'hello_world'
```

## API

### `slugify(text, options?)`

Returns the slug as a string.

| Parameter           | Type     | Default | Description                                        |
| ------------------- | -------- | ------- | -------------------------------------------------- |
| `text`              | `string` | —       | The text to convert.                                |
| `options.separator` | `string` | `'-'`   | Character used to join words and replace the rest. |

The input is transformed in four steps:

1. Unicode `NFKD` normalization, with combining marks (`U+0300`–`U+036F`)
   removed — so accented letters fall back to their ASCII base.
2. Lowercased.
3. Every run of characters outside `a-z0-9` is replaced by a single separator.
4. Leading and trailing separators are trimmed.

## Development

```bash
npm test     # runs the test suite via node --test
npm run build
```

`build` is a parse-and-smoke check rather than a bundling step: the package
ships plain ESM straight from `src/`.

## License

MIT — see [LICENSE](LICENSE). Copyright (c) 2026 Acme.
