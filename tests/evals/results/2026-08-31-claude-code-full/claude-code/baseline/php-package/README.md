# Slugger

Turns arbitrary text into URL-safe slugs.

## Requirements

- PHP `^8.3`

## Installation

```bash
composer require acme/slugger
```

## Usage

`Acme\Slugger\Slugger::slug()` transliterates the text to ASCII, lowercases it,
and replaces every run of non-alphanumeric characters with a separator. Leading
and trailing separators are trimmed.

```php
use Acme\Slugger\Slugger;

echo (new Slugger())->slug('Hello, World!'); // hello-world
```

The separator defaults to `-` and is set once per instance:

```php
echo (new Slugger('_'))->slug('Hello, World!'); // hello_world
```

## Testing

```bash
composer test
```

The `Tests` workflow runs `composer install` followed by `vendor/bin/phpunit` on
every pull request and on pushes to `main`.

## License

MIT — see [LICENSE.md](LICENSE.md).
