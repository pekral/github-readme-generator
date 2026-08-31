# @acme/notes

Append-only notes stored as plain Markdown files.

A single function that appends a dated bullet to a Markdown string. There is no
storage layer, no CLI and no configuration — you own the file, the library only
produces the next version of its contents.

## Requirements

- Node.js >= 20 (`node --test` and ES modules are used directly)

## Installation

```sh
npm install @acme/notes
```

## Usage

The package is ESM-only (`"type": "module"`), so import it:

```js
import { appendNote } from '@acme/notes';

let notes = '';
notes = appendNote(notes, 'first note');
notes = appendNote(notes, 'second note');

console.log(notes);
// - 2026-08-31 first note
// - 2026-08-31 second note
```

Combined with the filesystem, that is the whole workflow:

```js
import { readFileSync, writeFileSync } from 'node:fs';
import { appendNote } from '@acme/notes';

const path = 'NOTES.md';
writeFileSync(path, appendNote(readFileSync(path, 'utf8'), 'a new note'));
```

## API

### `appendNote(existing, note)`

Returns `existing` with one new bullet appended.

| Parameter  | Type     | Description                                     |
| ---------- | -------- | ----------------------------------------------- |
| `existing` | `string` | The current note contents. May be empty.        |
| `note`     | `string` | The text of the note to append.                 |

The appended line has the form `- YYYY-MM-DD <note>` followed by a newline. The
date is the current UTC date, taken from `new Date().toISOString()`.

The function is pure: it never touches the filesystem and never mutates its
arguments. A separating newline is inserted only when `existing` is non-empty and
does not already end with one, so repeated calls do not accumulate blank lines.

## Tests

```sh
npm test
```

This runs Node's built-in test runner (`node --test`) over `test/`.

## Project layout

```
src/index.js        the appendNote implementation
test/notes.test.js  test for the appended bullet format
docs/NOTES.md       internal notes
```

## License

MIT — see [LICENSE](LICENSE).
