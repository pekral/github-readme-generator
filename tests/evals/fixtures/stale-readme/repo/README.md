<img src="assets/logo.svg" alt="Palette">

# Palette

Palette grew out of a design-system audit where every hand-picked tint drifted a
little from the last one. It generates the whole ramp from one base colour, so a
palette stays internally consistent no matter who extends it.

## Install

```text
npm install @acme/palette@1.2
```

## Usage

```js
const palette = require('@acme/palette');
palette('#336699');
```

Run the dev server with `npm run serve` while you tweak a ramp.

See the [full guide](docs/GUIDE.md) for the colour-space maths.

Requires Node.js 14 or newer.
