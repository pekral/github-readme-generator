# mean & median

Two ES module functions for averaging an array of numbers.

## Modules

| File | Export | Returns |
| --- | --- | --- |
| `src/mean.js` | `mean(values)` | The arithmetic mean — the sum of `values` divided by their count. |
| `src/median.js` | `median(values)` | The middle value of `values` sorted ascending; the average of the two middle values when the count is even. |

## Usage

```js
import { mean } from './src/mean.js';
import { median } from './src/median.js';

mean([1, 2, 3, 4]);      // 2.5
median([1, 2, 3, 4]);     // 2.5
median([3, 1, 2]);        // 2
```

Both files use `export`, so they load as ES modules. Under Node.js that means importing them
from a `.mjs` file, or adding `"type": "module"` to a `package.json` in the consuming project.

## Behaviour

- **Empty input throws.** Both functions throw a `RangeError` when `values` is empty, rather
  than returning `NaN` or `undefined`:

  ```js
  mean([]);    // RangeError: mean() needs at least one value.
  median([]);  // RangeError: median() needs at least one value.
  ```

- **The input is never mutated.** `median` sorts a copy, so the array you pass in keeps its
  original order.

- **Numbers only.** `median` sorts numerically (`a - b`) and `mean` sums with `+`; neither
  function checks the type of the elements, so passing non-numbers yields `NaN` rather than
  an error.
