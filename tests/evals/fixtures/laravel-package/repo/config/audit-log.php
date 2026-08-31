<?php

declare(strict_types=1);

return [
    'enabled' => env('AUDIT_LOG_ENABLED', true),
    'retention_days' => env('AUDIT_LOG_RETENTION_DAYS', 90),
];
