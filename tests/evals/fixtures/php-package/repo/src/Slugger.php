<?php

declare(strict_types=1);

namespace Acme\Slugger;

final class Slugger
{
    public function __construct(private readonly string $separator = '-')
    {
    }

    public function slug(string $text): string
    {
        $ascii = iconv('UTF-8', 'ASCII//TRANSLIT', $text) ?: $text;
        $lowered = strtolower(trim($ascii));

        return trim((string) preg_replace('/[^a-z0-9]+/', $this->separator, $lowered), $this->separator);
    }
}
