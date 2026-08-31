# PHP package: a published Composer library

A single-class Composer library with tests, a licence, and CI that runs on the default branch — the case where a README has plenty of real evidence to draw on.

## Context

| | |
| --- | --- |
| Repository under test | [`tests/evals/fixtures/php-package/repo`](../../tests/evals/fixtures/php-package/repo) |
| Ecosystem | PHP, Composer, PHPUnit |
| Skill commit | `d7cfae8` — `skills/` was byte-identical at every commit the run spanned |
| Agent | Claude Code 2.1.251, default model |
| Prompt | `Write the root README.md for this repository.` — identical in both modes |
| Recorded | 2026-08-31 (56 s baseline, 110 s with the skill) |
| Raw run | `2026-08-31-claude-code-full`, on branch `publish-benchmark-results` |

## What the repository actually proves

- `composer.json` names `acme/slugger`, requires `php: ^8.3`, declares `MIT`, and defines `scripts.test` as `vendor/bin/phpunit`.
- `src/Slugger.php` exposes one public method, `slug(string $text): string`, and a constructor taking a separator that defaults to `-`.
- `tests/SluggerTest.php` covers both the default separator and a custom one.
- `LICENSE.md` is present.
- `.github/workflows/tests.yml` is named `Tests` and triggers on `push` to `main` and on `pull_request`.

## Baseline — the same agent, no skill

````markdown
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
````

## With `github-readme-generator`

````markdown
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
````

## What differs

### Both got right

Neither invented anything. Both took `composer require acme/slugger` from the manifest, both stated PHP 8.3 from the `require` constraint rather than guessing, both used the real namespace `Acme\Slugger\Slugger` and the real method, both showed the custom-separator constructor the tests exercise, and both took `composer test` from `scripts.test`. Neither emitted a coverage badge, and neither claimed a runtime the manifest does not support.

### Where the skill went further

**A licence badge backed by the licence file.** The skill emitted a `license-MIT` badge with the SPDX identifier taken from `composer.json` and the link pointing at the real filename, `LICENSE.md` rather than an assumed `LICENSE`. The baseline emitted no badge at all — not wrong, but it left evidence on the table.

**A title that says what the package does.** `Turn arbitrary text into URL-safe slugs` against the baseline's `Slugger`.

**The algorithm documented from the source.** The skill's `What it does` lists the four steps `slug()` actually performs, including that `iconv()` transliteration falls back to the original text on failure — a detail only readable in `src/Slugger.php`.

### Where the baseline went further

**It described the CI workflow in prose:** *"The `Tests` workflow runs `composer install` followed by `vendor/bin/phpunit` on every pull request and on pushes to `main`."* That is accurate, and it is evidence the skill had and did not use. The skill emitted no CI badge either, although `.github/workflows/tests.yml` triggers on `push` to the default branch and therefore earns one under the skill's own liveness rule.

### Verdict

No factual difference. The skill's output is tighter and carries one more evidence-backed badge; the baseline surfaced one piece of CI evidence the skill dropped.
