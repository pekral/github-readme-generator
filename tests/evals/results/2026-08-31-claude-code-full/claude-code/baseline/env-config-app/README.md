# acme-invoices

An HTTP service that validates its configuration from the environment at startup. `loadConfig()` fails fast with `Missing configuration: …` when a required variable is absent, so the process never starts half-configured.

No runtime dependencies — the service is built on Node's own `node:http`.

## Requirements

- Node.js >= 20 (declared in `package.json`)

## Installation

```bash
git clone <repository-url>
cd acme-invoices
cp .env.example .env
```

There are no dependencies to install.

## Configuration

Configuration is read from the process environment by `src/config.js`. The three required variables are checked at startup; the application does not read a `.env` file on its own — export the variables into the environment yourself, or use Node's `--env-file` flag (Node 20.6+).

| Variable | Required | Default | Used as |
| --- | --- | --- | --- |
| `APP_URL` | yes | — | `config.appUrl` |
| `DATABASE_URL` | yes | — | `config.databaseUrl` |
| `MAILER_DSN` | yes | — | `config.mailerDsn` |
| `SESSION_TTL_MINUTES` | no | `120` | `config.sessionTtlMinutes` (numeric) |

`.env.example` holds a working local set of these values.

## Quick start

```bash
node --env-file=.env src/server.js
```

Or, with the variables already exported in your shell:

```bash
npm start
```

The server listens on port `3000` (hardcoded in `src/server.js`) and answers every request with `acme-invoices at <APP_URL>`:

```bash
curl http://localhost:3000
# acme-invoices at http://localhost:3000
```

## Usage

`loadConfig()` is exported from `src/config.js` and can be called with an explicit environment object instead of `process.env`:

```js
import { loadConfig } from './src/config.js';

const config = loadConfig({
  APP_URL: 'http://localhost:3000',
  DATABASE_URL: 'postgres://user:password@localhost:5432/invoices',
  MAILER_DSN: 'smtp://localhost:1025',
});

config.sessionTtlMinutes; // 120
```

## Tests

```bash
npm test
```

Runs Node's built-in test runner (`node --test`) over `test/`.

## Project structure

```
src/config.js   environment validation and the config object
src/server.js   HTTP entry point
test/           node:test suite
```
