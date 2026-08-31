# Stale documentation: a README that has drifted from its package

An existing README with a real logo and genuinely useful hand-written prose, wrapped around a wrong version, a dead link, a script that no longer exists, a CommonJS example for an ESM-only package, and a runtime claim the manifest contradicts. This is the pair where the two modes actually diverge — and not in the direction you might expect.

## Context

| | |
| --- | --- |
| Repository under test | [`tests/evals/fixtures/stale-readme/repo`](../../tests/evals/fixtures/stale-readme/repo) |
| Ecosystem | Node.js, npm, node:test |
| Skill commit | `d7cfae8` — `skills/` was byte-identical at every commit the run spanned |
| Agent | Claude Code 2.1.251, default model |
| Prompt | `Write the root README.md for this repository.` — identical in both modes |
| Recorded | 2026-08-31 (98 s baseline, 224 s with the skill) |
| Raw run | `2026-08-31-claude-code-full`, on branch `publish-benchmark-results` |

## What the repository actually proves

`package.json` says version `3.0.0`, `engines.node` `>=20`, `"type": "module"`, and defines exactly two scripts, `test` and `build`. `assets/logo.svg` exists. There is no `docs/` directory.

The README already in the repository claimed:

- `npm install @acme/palette@1.2` — the manifest says `3.0.0`
- `const palette = require('@acme/palette')` — the package is ESM-only
- *"Run the dev server with `npm run serve`"* — no such script
- a link to `docs/GUIDE.md` — the file does not exist
- *"Requires Node.js 14 or newer"* — `engines` says `>=20`

It also carried a logo and an opening paragraph explaining that the package came out of a design-system audit where hand-picked tints drifted apart.

## Baseline — the same agent, no skill

````markdown
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
````

## With `github-readme-generator`

````markdown
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
````

## What differs

### Both got right

Every stale claim is gone from both. No `@1.2`, no `require()`, no `npm run serve`, no `docs/GUIDE.md`, no Node 14. Both kept the logo, both documented the two scripts that exist, and both derived the ramp behaviour from `src/index.js` rather than guessing.

### Where the skill went further

**It documented the failure mode.** The skill shows what `palette('336699')` does — `TypeError: palette() needs a #rrggbb colour.` — quoting the message from the source. The baseline stated that invalid input throws a `TypeError` without showing it.

**It stated the module format as guidance:** *"This package ships as ES modules only, so load it with `import` rather than `require()`"* — the correction a reader of the old README most needs.

**Section order.** Requirements → Installation → Quick start, unbroken. The baseline titled the section `Install` and folded its API table into `Usage`.

### Where the baseline went further — and the skill regressed

**The baseline kept the author's paragraph. The skill did not.**

The original README opened with:

> Palette grew out of a design-system audit where every hand-picked tint drifted a little from the last one. It generates the whole ramp from one base colour, so a palette stays internally consistent no matter who extends it.

The baseline reproduced it intact. The skill replaced it with *"Accessible colour palettes generated from a single base colour. Pick one colour, get the whole ramp."* — keeping the second half of the idea and dropping the origin story that explains why the package exists.

That is a regression against the skill's own rule. `references/readme-structure.md` tells Update mode to keep *"valid branding, useful hand-written explanation, and working links"* and to *"fix only what is outdated, unsupported, duplicated, or badly ordered"*. The paragraph was none of those things.

### Verdict

Both fixed every factual defect. On the one dimension where they differ, **the baseline was better**: it preserved authored prose that the skill discarded while following the rest of its instructions. This pair is published because it is the most useful one in the run — it is the only one that shows a defect worth fixing, and the defect is the skill's.
