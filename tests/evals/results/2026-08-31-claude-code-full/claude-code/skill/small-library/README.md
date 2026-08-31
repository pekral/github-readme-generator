# Mean and median for arrays of numbers

Two ES modules that reduce an array of numbers to a single summary value. Each
function lives in its own file and has no dependencies, so you import only the
statistic you need.

## Quick start

```js
import { mean } from './src/mean.js';
import { median } from './src/median.js';

mean([2, 4, 4, 4, 5, 5, 7, 9]);   // 5
median([2, 4, 4, 4, 5, 5, 7, 9]); // 4.5
```

`median` sorts a copy, so the array you pass in keeps its original order:

```js
const samples = [5, 1, 3];

median(samples); // 3
samples;         // [5, 1, 3]
```

## API

### `mean(values)`

The arithmetic mean: the sum of `values` divided by how many there are.

### `median(values)`

The middle value of `values` in ascending order. With an even number of values,
the mean of the two middle ones.

### Empty input

Neither function returns `NaN` for an empty array — both throw instead:

```js
mean([]);   // RangeError: mean() needs at least one value.
median([]); // RangeError: median() needs at least one value.
```
