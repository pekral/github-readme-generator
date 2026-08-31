<img src="assets/logo.svg" alt="Palette">

# Palette

Accessible colour palettes generated from a single base colour.

Pick one colour, get the whole ramp. Every step is derived by the same formula,
so a palette stays internally consistent no matter who extends it later.

## Requirements

- Node.js 20 or newer

## Installation

```sh
npm install @acme/palette
```

## Quick start

`palette()` takes a `#rrggbb` colour and returns the ramp as an array of hex
strings, starting at your base colour and ending at white.

```js
import { palette } from '@acme/palette';

palette('#336699');
// [ '#336699', '#668cb3', '#99b3cc', '#ccd9e6', '#ffffff' ]
```

Ask for a different number of steps with the `steps` option:

```js
palette('#336699', { steps: 3 });
// [ '#336699', '#99b3cc', '#ffffff' ]
```

## API

### `palette(baseColour, options?)`

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `baseColour` | `string` | — | Six-digit hex colour, e.g. `#336699`. |
| `options.steps` | `number` | `5` | Number of colours in the returned ramp. |

Returns an array of `steps` hex strings. The first entry is `baseColour` and the
last is `#ffffff`.

Throws a `TypeError` when `baseColour` is not a six-digit hex string:

```js
palette('336699');
// TypeError: palette() needs a #rrggbb colour.
```

This package ships as ES modules only, so load it with `import` rather than
`require()`.

## Development

```sh
npm test     # run the test suite with node --test
npm run build
```

## License

MIT — see [LICENSE](LICENSE).
