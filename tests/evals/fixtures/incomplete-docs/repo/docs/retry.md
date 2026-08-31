# retry()

```js
import { retry } from '@acme/retry';

await retry(() => fetch('https://example.com'), { attempts: 5 });
```
