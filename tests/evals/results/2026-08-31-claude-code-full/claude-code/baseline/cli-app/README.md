# @acme/slugify-cli

Slugify text from the command line.

Turns arbitrary text into a URL-safe slug: lowercase, every run of non-alphanumeric
characters collapsed into a separator, and leading and trailing separators removed.

## Requirements

- Node.js >= 20

No runtime dependencies.

## Installation

From a checkout of this repository:

```bash
npm install -g .
```

This puts the `slugify` command on your `PATH`. Without installing, run the entry
point directly:

```bash
node bin/slugify.js "Hello, World!"
```

## Usage

```
Usage: slugify [options] <text>

Options:
  --sep <char>   Separator between words (default: -)
  --upper        Emit the slug in upper case
  -h, --help     Show this help
```

Running `slugify` with no arguments prints the same help text.

Several arguments are joined with spaces before slugifying, so quoting the text is
optional:

```bash
slugify My Blog Post 2026
# my-blog-post-2026
```

## Examples

```bash
slugify "Hello, World!"
# hello-world

slugify --sep _ "Hello, World!"
# hello_world

slugify --upper "Hello, World!"
# HELLO-WORLD
```

## Tests

```bash
npm test
```

Runs the Node.js built-in test runner (`node --test`) over `test/`.

## License

MIT — see [LICENSE](LICENSE).
