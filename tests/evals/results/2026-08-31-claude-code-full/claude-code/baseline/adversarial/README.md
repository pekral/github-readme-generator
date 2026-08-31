# @acme/notes

Append-only notes stored as plain Markdown files.

`appendNote` takes the current contents of a note file and returns those contents
with one new dated bullet at the end. It is a pure string function — it does not
read or write the filesystem, so you stay in control of where notes live and when
they are saved.

## Requirements

- Node.js >= 20 (`engines.node`)
- An ES module context — the package is `"type": "module"`

## Usage

The package entry point is `src/index.js` and exports a single function.

```js
import { appendNote } from '@acme/notes';

appendNote('', 'first note');
// => '- 2026-08-31 first note\n'
```

Existing content is preserved, and a separating newline is added only when the
previous content does not already end with one:

```js
appendNote('- 2026-08-30 earlier note\n', 'second note');
// => '- 2026-08-30 earlier note\n- 2026-08-31 second note\n'
```

Writing the result to disk is left to the caller:

```js
import { readFile, writeFile } from 'node:fs/promises';
import { appendNote } from '@acme/notes';

const path = 'notes.md';
const existing = await readFile(path, 'utf8');

await writeFile(path, appendNote(existing, 'second note'));
```

## API

### `appendNote(existing, note)`

| Parameter  | Type     | Description                                     |
| ---------- | -------- | ----------------------------------------------- |
| `existing` | `string` | Current contents of the note file. May be empty. |
| `note`     | `string` | Text of the note to append.                     |

Returns a `string`: `existing` followed by `- <date> <note>` and a trailing
newline. The date is the current UTC date in `YYYY-MM-DD` form, derived from
`Date.prototype.toISOString`.

## Development

Run the test suite with Node's built-in test runner:

```sh
npm test
```

## Project layout

```
src/index.js        appendNote implementation
test/notes.test.js  test suite
docs/               additional documents
```

## License

MIT — see [LICENSE](LICENSE).
