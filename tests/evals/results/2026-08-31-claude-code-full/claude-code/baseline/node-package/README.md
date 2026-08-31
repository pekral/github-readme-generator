# @acme/slugify

Turns arbitrary text into URL-safe slugs.

A single dependency-free ESM function. It normalises accented characters down to
ASCII, lowercases the result, and collapses everything that is not a letter or a
digit into a separator.

## Requirements

- Node.js >= 20 (declared in `package.json` `engines`)

The package ships plain ESM (`"type": "module"`), so import it with `import`
rather than `require`.

## Installation

```bash
npm install @acme/slugify
```

## Usage

```js
import { slugify } from '@acme/slugify';

slugify('Hello, World!');
// 'hello-world'

slugify('Hello, World!', { separator: '_' });
// 'hello_world'
```

Diacritics are decomposed and stripped, so accented input collapses to ASCII:

```js
slugify('Příliš žluťoučký kůň');
// 'prilis-zlutoucky-kun'
```

## API

### `slugify(text, options?)`

| Parameter           | Type     | Default | Description                                                        |
| ------------------- | -------- | ------- | ------------------------------------------------------------------ |
| `text`              | `string` | —       | The text to slugify.                                               |
| `options.separator` | `string` | `'-'`   | Character inserted in place of runs of non-alphanumeric characters. |

Returns a `string`.

The transformation, in order:

1. Unicode NFKD normalisation.
2. Combining marks (`U+0300`–`U+036F`) are removed.
3. The text is lowercased.
4. Every run of characters outside `a-z0-9` is replaced with the separator.
5. Leading and trailing separators are trimmed.

Characters that carry no ASCII decomposition (for example CJK or emoji) are not
transliterated — they fall into step 4 and are replaced by the separator. The
separator is interpolated into a regular expression in step 5, so pass a single
character.

## Scripts

| Command         | What it does                                                      |
| --------------- | ----------------------------------------------------------------- |
| `npm test`      | Runs `node --test` against `test/index.test.js`.                  |
| `npm run build` | Runs `scripts/build.js`, a parse-and-smoke check — no artefact.   |
| `npm run lint`  | Runs `eslint src`.                                                 |

There is no build output: the package publishes the source in `src/` as-is, and
`scripts/build.js` only imports the module and asserts one known slug so that a
syntax error or a behaviour regression fails the step.

`npm run lint` expects `eslint` to be resolvable. The package declares no
dependencies and no ESLint configuration file is committed, so the script only
works where ESLint is provided by the surrounding environment.

## Project layout

```
src/index.js          the slugify function
test/index.test.js    node:test suite
scripts/build.js      parse/smoke check invoked by npm run build
```

## License

MIT — see [LICENSE](LICENSE).
