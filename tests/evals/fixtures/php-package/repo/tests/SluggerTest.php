<?php

declare(strict_types=1);

namespace Acme\Slugger\Tests;

use Acme\Slugger\Slugger;
use PHPUnit\Framework\TestCase;

final class SluggerTest extends TestCase
{
    public function testItSlugsText(): void
    {
        self::assertSame('hello-world', (new Slugger())->slug('Hello, World!'));
    }

    public function testItHonoursACustomSeparator(): void
    {
        self::assertSame('hello_world', (new Slugger('_'))->slug('Hello, World!'));
    }
}
