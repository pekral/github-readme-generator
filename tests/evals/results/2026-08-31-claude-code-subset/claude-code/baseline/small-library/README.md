# mean & median

Two small ES module functions for averaging an array of numbers.

## Contents

| File | Export | Purpose |
| --- | --- | --- |
| `src/mean.js` | `mean(values)` | Arithmetic mean of `values` |
| `src/median.js` | `median(values)` | Median of `values` |

Both files are ES modules (`export function`) with no dependencies.

## Usage

```js
import { mean } from './src/mean.js';
import { median } from './src/median.js';

mean([1, 2, 3, 4]);      // 2.5
median([3, 1, 2]);       // 2
median([4, 1, 3, 2]);    // 2.5
```

## API

### `mean(values)`

Sums `values` and divides by `values.length`.

- **`values`** — array of numbers.
- **Returns** the arithmetic mean.
- **Throws** `RangeError` when `values` is empty.

### `median(values)`

Sorts a copy of `values` ascending with a numeric comparator, then returns the
middle element. For an even number of values it returns the mean of the two
middle elements. The array you pass in is not mutated.

- **`values`** — array of numbers.
- **Returns** the median.
- **Throws** `RangeError` when `values` is empty.

## Repository layout

The repository contains source only:

```
src/
  mean.js
  median.js
```

There is no `package.json`, build step, or test suite, so the files are meant to
be imported directly by a project that supplies its own module configuration
(for example `"type": "module"`, or an `.mjs` extension when loaded by Node).
