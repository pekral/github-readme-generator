# @acme/retry

Retry helpers with backoff and cancellation.

An ES module for Node.js that retries a failing async operation on an exponential
backoff schedule, and lets you cancel the loop from the outside.

## Requirements

- Node.js 20 or newer

## Installation

```text
npm install @acme/retry
```

## Quick start

```js
import { retry, CancellationToken } from '@acme/retry';

const token = new CancellationToken();

const response = await retry(
  (attempt) => fetch(`https://example.com/?attempt=${attempt}`),
  { attempts: 5, token },
);
```

`retry()` calls the operation until it returns without throwing. If every attempt
fails, the error from the last attempt is rethrown.

## API

All three exports come from the package root.

### `retry(operation, options?)`

Runs `operation(attempt)` — where `attempt` is the zero-based attempt index —
and retries it when it throws. Waits `backoff(attempt)` milliseconds between
attempts. Resolves with the operation's return value; rejects with the error
thrown by the final attempt.

| Option | Default | Meaning |
| --- | --- | --- |
| `attempts` | `3` | Maximum number of calls to `operation` |
| `token` | – | A `CancellationToken` checked before each attempt |

### `backoff(attempt, options?)`

Returns the delay in milliseconds for a given attempt index:
`min(cap, base * 2 ** attempt)`.

| Option | Default | Meaning |
| --- | --- | --- |
| `base` | `100` | Delay for attempt `0`, in milliseconds |
| `cap` | `5000` | Upper bound on the delay, in milliseconds |

With the defaults, the delays are 100 ms, 200 ms, 400 ms, and so on up to 5000 ms.
Note that `retry()` calls `backoff()` without options, so `base` and `cap` apply
only when you call `backoff()` yourself.

### `CancellationToken`

```js
import { retry, CancellationToken } from '@acme/retry';

const token = new CancellationToken();
setTimeout(() => token.cancel(), 1000);

await retry(() => doWork(), { token }); // rejects with "Operation cancelled."
```

- `cancel()` — marks the token as cancelled.
- `throwIfCancelled()` — throws `Error('Operation cancelled.')` once cancelled.

`retry()` calls `throwIfCancelled()` before each attempt, so cancelling
interrupts the loop rather than the in-flight operation.

## Tests

```text
npm test
```

Runs the Node.js built-in test runner (`node --test`).

## Documentation

- [Documentation index](docs/index.md)
- [Installation](docs/installation.md)
- [`retry()`](docs/retry.md)

Backoff tuning and cancellation are not covered in `docs/` yet; the API section
above is the reference for those.

## License

MIT — see [LICENSE](LICENSE).
