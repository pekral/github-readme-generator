# Retry an async operation with exponential backoff

[![MIT Licensed](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](LICENSE)

`@acme/retry` re-runs an async operation until it succeeds or the attempts run
out, waiting an exponentially growing delay in between. A cancellation token
stops the loop from the outside, so a caller can abandon a retry that is no
longer worth waiting for.

## Requirements

Node.js 20 or newer.

## Installation

```text
npm install @acme/retry
```

## Quick start

```js
import { retry } from '@acme/retry';

const response = await retry(() => fetch('https://example.com'), { attempts: 5 });
```

The operation receives the zero-based attempt number, and its resolved value is
returned. When every attempt throws, `retry` rethrows the last error.

## API

### `retry(operation, { attempts = 3, token })`

Calls `operation(attempt)` until it resolves, at most `attempts` times, sleeping
`backoff(attempt)` milliseconds after each failure.

### `backoff(attempt, { base = 100, cap = 5000 })`

Returns `min(cap, base * 2 ** attempt)` — 100 ms for the first attempt, doubling,
capped at 5000 ms.

```js
import { backoff } from '@acme/retry';

backoff(0); // 100
backoff(50); // 5000
```

### `CancellationToken`

`retry` checks the token before every attempt and throws
`Error('Operation cancelled.')` once `cancel()` has been called.

```js
import { retry, CancellationToken } from '@acme/retry';

const token = new CancellationToken();
setTimeout(() => token.cancel(), 1000);

await retry(() => fetch('https://example.com'), { token });
```

## Documentation

Further notes live in [`docs/`](docs/index.md).

## Testing

```text
npm test
```

## License

MIT — see [LICENSE](LICENSE).
