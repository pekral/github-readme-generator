# Audit log storage for Laravel

[![MIT Licensed](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](LICENSE.md)

Ships the `audit_logs` table and a publishable configuration file for an audit trail of model changes. The service provider is auto-discovered, so installing the package and running the migration creates the storage.

> [!NOTE]
> The package provides storage and configuration only. It contains no trait,
> observer, or event listener that writes rows, and no code in the package reads
> the configuration keys below. Recording changes is left to the application.

## Requirements

- PHP `^8.3`
- Laravel `^12.0`

## Installation

```shell
composer require acme/audit-log
```

`Acme\AuditLog\AuditLogServiceProvider` is registered through Laravel's package auto-discovery.

The migration is loaded from the package and needs no publishing:

```shell
php artisan migrate
```

## Configuration

Publish the configuration file to `config/audit-log.php`:

```shell
php artisan vendor:publish --tag=audit-log-config
```

| Key | Environment variable | Default |
| --- | --- | --- |
| `enabled` | `AUDIT_LOG_ENABLED` | `true` |
| `retention_days` | `AUDIT_LOG_RETENTION_DAYS` | `90` |

## Database schema

`audit_logs`, as created by the packaged migration:

| Column | Type |
| --- | --- |
| `id` | auto-incrementing big integer |
| `auditable_type`, `auditable_id` | polymorphic reference (`morphs`), indexed |
| `changes` | `json` |
| `created_at`, `updated_at` | nullable timestamps |

## License

MIT. See [LICENSE.md](LICENSE.md).
