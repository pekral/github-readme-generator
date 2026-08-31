<?php

declare(strict_types=1);

namespace Acme\AuditLog;

use Illuminate\Support\ServiceProvider;

final class AuditLogServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        $this->publishes([
            __DIR__ . '/../config/audit-log.php' => config_path('audit-log.php'),
        ], 'audit-log-config');

        $this->loadMigrationsFrom(__DIR__ . '/../database/migrations');
    }
}
