# Turn arbitrary text into URL-safe slugs

[![MIT Licensed](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](LICENSE.md)

`acme/slugger` converts any string into a lowercase, ASCII-only slug you can put
in a URL. It is a single class with no dependencies beyond PHP itself.

## Requirements

- PHP 8.3 or newer

## Installation

```text
composer require acme/slugger
```

## Quick start

```php
use Acme\Slugger\Slugger;

$slugger = new Slugger();

$slugger->slug('Hello, World!'); // 'hello-world'
```

Pass a different separator to the constructor:

```php
$slugger = new Slugger('_');

$slugger->slug('Hello, World!'); // 'hello_world'
```

## What it does

`slug()` applies these steps, in order:

1. Transliterates the text to ASCII with `iconv()`, keeping the original text if
   transliteration fails.
2. Lowercases and trims it.
3. Replaces every run of characters outside `a-z0-9` with the separator.
4. Trims separators from both ends.

## Testing

```text
composer test
```

## License

Released under the MIT License. See [LICENSE.md](LICENSE.md).
