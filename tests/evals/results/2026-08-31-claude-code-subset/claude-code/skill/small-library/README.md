# Mean and median for numeric arrays

Two ES modules that compute the arithmetic mean and the median of an array of
numbers. Both reject an empty array instead of returning `NaN` or `undefined`.

## Quick start

The repository ships no package manifest, so import the modules by path.

```js
import { mean } from './src/mean.js';
import { median } from './src/median.js';

mean([2, 4, 9]);       // 5
median([7, 1, 3]);     // 3
median([4, 1, 3, 2]);  // 2.5 — an even count averages the two middle values
```

## Behaviour

- `mean(values)` sums the values and divides by their count.
- `median(values)` sorts numerically on a copy, so the array you pass in is left unchanged.
- Both throw a `RangeError` when `values` is empty.
