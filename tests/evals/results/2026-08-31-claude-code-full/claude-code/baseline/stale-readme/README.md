<img src="assets/logo.svg" alt="Palette">

# Palette

Palette grew out of a design-system audit where every hand-picked tint drifted a
little from the last one. It generates the whole ramp from one base colour, so a
palette stays internally consistent no matter who extends it.

## Requirements

- Node.js 20 or newer
- ES modules — the package ships as `"type": "module"` and has no CommonJS build

## Install

```text
npm install @acme/palette
```

## Usage

`palette()` takes a `#rrggbb` colour and returns that many hex strings, tinting
from the base colour to white:

```js
import { palette } from '@acme/palette';

palette('#336699');
// ['#336699', '#668cb3', '#99b3cc', '#ccd9e6', '#ffffff']

palette('#336699', { steps: 3 });
// ['#336699', '#99b3cc', '#ffffff']
```

### `palette(baseColour, options?)`

| Argument | Type | Default | Description |
| --- | --- | --- | --- |
| `baseColour` | `string` | — | Six-digit hex colour with a leading `#`, e.g. `#336699`. Case-insensitive. |
| `options.steps` | `number` | `5` | Number of colours in the returned ramp, base colour included. |

Anything that is not a six-digit `#rrggbb` string throws a `TypeError`.

## Development

```text
npm test    # runs the node:test suite
npm run build
```

## License

MIT — see [LICENSE](LICENSE).
