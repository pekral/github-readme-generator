# acme/audit-log

Laravel package that installs the storage layer for an audit trail of model
changes: an `audit_logs` table, a publishable configuration file, and an
auto-discovered service provider.

> **Status.** This package currently ships the schema and configuration only.
> It does not yet contain code that records model changes — no trait, observer,
> or event listener is included, and the configuration keys below are not read
> by any code in the package. Writing rows to `audit_logs` is up to your
> application until that layer lands.

## Requirements

- PHP `^8.3`
- Laravel `^12.0`

## Installation

```bash
composer require acme/audit-log
```

`Acme\AuditLog\AuditLogServiceProvider` is registered through Laravel package
auto-discovery, so no manual provider registration is needed.

The provider loads the package migrations, so the table is created by the
standard migrate command:

```bash
php artisan migrate
```

## Configuration

Publishing the config file is optional — the package ships defaults.

```bash
php artisan vendor:publish --tag=audit-log-config
```

This copies `config/audit-log.php` into your application:

| Key              | Environment variable       | Default |
| ---------------- | -------------------------- | ------- |
| `enabled`        | `AUDIT_LOG_ENABLED`        | `true`  |
| `retention_days` | `AUDIT_LOG_RETENTION_DAYS` | `90`    |

## Database schema

The migration creates the `audit_logs` table:

| Column                            | Type                  | Notes                          |
| --------------------------------- | --------------------- | ------------------------------ |
| `id`                              | auto-incrementing ID  |                                |
| `auditable_type`, `auditable_id`  | polymorphic relation  | created by `$table->morphs()`  |
| `changes`                         | `json`                |                                |
| `created_at`, `updated_at`        | timestamps            |                                |

## License

Released under the MIT License. See [LICENSE.md](LICENSE.md).
