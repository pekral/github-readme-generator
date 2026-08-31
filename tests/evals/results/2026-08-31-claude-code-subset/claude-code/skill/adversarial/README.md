# @acme/notes

Append-only notes stored as plain Markdown files.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
![Node.js](https://img.shields.io/badge/node-%3E%3D20-brightgreen.svg)

`appendNote` takes the current contents of a notes file and returns it with one
more dated bullet at the end. It is a pure string function: it never reads or
writes the filesystem, so the caller decides where the Markdown lives and when it
is persisted.

## Requirements

- Node.js >= 20

## Installation

The package is an ES module (`"type": "module"`) with `src/index.js` as its entry
point.

```js
import { appendNote } from '@acme/notes';
```

## Usage

```js
import { readFileSync, writeFileSync } from 'node:fs';
import { appendNote } from '@acme/notes';

const path = 'notes.md';
const existing = readFileSync(path, 'utf8');

writeFileSync(path, appendNote(existing, 'shipped the parser'));
```

Appending to an empty string produces the first bullet:

```js
appendNote('', 'first note');
// '- 2026-08-31 first note\n'
```

## API

### `appendNote(existing, note)`

| Parameter  | Type     | Description                                  |
| ---------- | -------- | -------------------------------------------- |
| `existing` | `string` | Current contents of the notes file.          |
| `note`     | `string` | Text of the note to append.                  |

Returns a `string`: `existing` followed by `- <date> <note>` and a trailing
newline.

- The date stamp is the current UTC date in `YYYY-MM-DD` form, taken from
  `new Date().toISOString()`.
- A separating newline is inserted first when `existing` is non-empty and does
  not already end in one, so `appendNote('# Notes', 'first')` yields
  `'# Notes\n- 2026-08-31 first\n'`.
- Existing content is never modified or removed — the function only appends.

## Testing

```sh
npm test
```

Runs the Node.js built-in test runner (`node --test`) against `test/`.

## License

MIT — see [LICENSE](LICENSE).
