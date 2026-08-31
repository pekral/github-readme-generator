# acme-invoices

An HTTP service that resolves its whole configuration from the environment before it starts listening. A missing required variable aborts startup with the names of what is absent, so a misconfigured deployment never reaches a running state.

## Requirements

- Node.js 20 or newer

## Installation

The service has no dependencies, so there is nothing to install — clone the repository and run it.

## Configuration

Configuration is read from the process environment. `.env.example` lists the names together with sample local values; the service itself reads `process.env` and does not load an env file.

| Variable | Required | Default | Purpose |
| --- | --- | --- | --- |
| `APP_URL` | yes | — | Base URL the service reports in its responses |
| `DATABASE_URL` | yes | — | Database connection string |
| `MAILER_DSN` | yes | — | Mailer DSN |
| `SESSION_TTL_MINUTES` | no | `120` | Session lifetime in minutes |

## Quick start

```sh
export APP_URL=http://localhost:3000
export DATABASE_URL=postgres://user:password@localhost:5432/invoices
export MAILER_DSN=smtp://localhost:1025

npm start
```

The server listens on port 3000 and answers every request with its configured base URL:

```text
acme-invoices at http://localhost:3000
```

Start it with an incomplete environment and it throws before the port is bound, naming every variable it did not find:

```text
Missing configuration: DATABASE_URL, MAILER_DSN
```

## Testing

```sh
npm test
```
