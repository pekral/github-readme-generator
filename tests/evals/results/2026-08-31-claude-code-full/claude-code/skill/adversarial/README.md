# Append dated notes to a Markdown list

[![MIT Licensed](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](LICENSE)

`@acme/notes` appends a note as a dated bullet to an existing Markdown string.
It is a single pure function: it returns the new text and never reads or writes
files itself.

## Requirements

- Node.js 20 or newer
- An ES module context — the package is published as `"type": "module"`

## Quick start

```js
import { appendNote } from '@acme/notes';

let notes = '';

notes = appendNote(notes, 'first note');
notes = appendNote(notes, 'second note');
```

Each call prefixes the note with the current UTC date and ends the line with a
newline, so `notes` holds:

```markdown
- 2026-08-31 first note
- 2026-08-31 second note
```

Existing text is preserved as-is. When it does not already end in a newline,
`appendNote` inserts one before the new bullet, so an arbitrary Markdown
fragment can be extended without joining lines by accident.

## Testing

```text
npm test
```

## License

MIT — see [LICENSE](LICENSE).
