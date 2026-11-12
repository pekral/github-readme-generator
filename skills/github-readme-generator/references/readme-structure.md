# README structure

Load before drafting. The order below is the default reading path for a new
user, not a mandatory list of headings. Drop any section you cannot back with
evidence.

## Default order

The reader installs, configures, runs, and only then explores. Keep that path
unbroken — no section may sit between two steps of it. Configuration comes
before the first example because an example that needs unset configuration to
work is not a quick start.

1. header block — existing logo or light/dark banner, project name, badges (see
   below)
2. intro: two or three concrete sentences on what it does and for whom
3. `Requirements` — verified runtimes, tools, system prerequisites
4. `Installation` — verified install command
5. `Configuration` — existing config keys and env var names, never real secrets
6. `Quick start` — smallest verified example with a useful result
7. `What it does` — capability list, only when the intro genuinely cannot carry it
8. `Documentation` — link to separate docs, when they exist
9. `Testing` — verified test command
10. `Upgrading` — only with an existing upgrade guide or specific procedure
11. `Changelog`, `Contributing`, `Security` — link the files that exist
12. `Credits` — verified names, or a contributors link
13. `License` — short verified statement plus a link to the license file

A capability list is not part of the install path, so it goes after it — never
between the intro and `Requirements`. The same holds for developer information
and project history: none of it may sit inside the install path.

### Section names

Use the names above verbatim, in sentence case: `Quick start`, never
`Quickstart`, `Quick Start`, or `Getting started`; `Requirements`, never
`Prerequisites`. When updating a README, rename a section that carries the same
content under another name rather than adding a second one.

### The install path

- `Installation` contains the main install command itself, in a code block. A
  link alone ("see the docs") is not an installation section; link the docs for
  variants and edge cases after the command.
- Configuration the first run cannot work without comes before `Quick start`.
  For optional configuration, state the default behaviour in a sentence and link
  the full reference in the documentation instead of reproducing it.
- The first example is the shortest complete path to a useful result, not a tour
  of the API surface.
- A limitation, or a warning that a command overwrites or deletes files, sits
  right next to that command — never only deeper in the documentation.

### Length

As a guide, a simple package lands at 100–200 lines and a more complex project
at 200–300. This is a signal to cut or move detail into the documentation, not a
limit to enforce mechanically.

`Support`, `Sponsors`, `Alternatives`, `Roadmap`, `Deployment`, `API`, and
`Architecture` are optional. Add one only when it matters for this project and
the repository supports it.

## Cut everything that is not load-bearing

Simplicity is the point. A short README that is entirely true beats a thorough
one padded to look complete.

- Emit a section only when it has verified content. No section, no heading.
- Every sentence must carry a fact the reader cannot get from the command right
  next to it. Delete anything that only announces what follows.
- Prefer showing the command over describing it. A code block usually replaces
  its own introduction.
- Say a thing once. When two sections would repeat it, keep it in the earlier
  one and link.
- No filler adjectives, no "powerful", "seamless", "simply", "just".
- Cap the intro at two or three sentences.
- If a bullet list runs past six items, the section is doing someone else's job —
  cut it or move the detail to the documentation it belongs to.

## Header block

The header carries identity before anything else: visual mark, project name,
evidence badges, then the intro. It is left-aligned. Two shapes, chosen by
whether the project owns a logo; use exactly these two, so every README built
with this skill has the same header.

The title is the project name, so a reader who searched for it finds it at once.
The purpose goes into the intro sentences, not into the heading.

**With a logo or banner** — wrap the whole header so the assets, title, and
badges read as one unit. Inside an HTML block, Markdown headings stop working, so
the title must be an explicit `<h1>`; the badge lines stay Markdown and need a
blank line around them.

```html
<div align="left">
    <picture>
        <source media="(prefers-color-scheme: dark)" srcset="<dark asset>">
        <img alt="<meaningful description>" src="<light asset>">
    </picture>

<h1><project name></h1>

<badge lines>

</div>
```

Wrap the `<picture>` in a link only when the existing README already links it and
the target still belongs to the project. Never add a sponsor, campaign, or
tracking URL of your own.

Keep an existing logo or banner; never create a new image. **Without a logo** —
no HTML wrapper. A plain Markdown heading followed by a
blank line and the badge lines:

```markdown
# <project name>

<badge lines>
```

No horizontal rule after the header or between sections — headings already
separate them.

Badges go on consecutive lines, each its own line, in a stable order: package
version, license, CI, downloads — at most four. Take the markup from the
templates in `evidence-policy.md` and drop any badge whose evidence is missing.

## Ecosystem specifics

The table says where to look, never what to write. A cell names the source; if
that source is absent or says something different, the README follows the source
or omits the section.

| Ecosystem | Manifest | Install command | Test command | Registry badge | Fence |
| --- | --- | --- | --- | --- | --- |
| PHP | `composer.json` | `composer require <name>` for a library, `composer install` for an app | `scripts.test`, else the CI step | Packagist, from `name` | `php` |
| Node | `package.json` | the package manager the lock file proves | `scripts.test` | npm, from `name` | `js` / `ts` |
| Python | `pyproject.toml` | `pip install <project.name>`, or the documented installer | the test runner in the tool config or CI | PyPI, from `project.name` | `python` |
| Rust | `Cargo.toml` | `cargo add <package.name>` | `cargo test` when a test target exists | crates.io, from `package.name` | `rust` |
| Go | `go.mod` | `go get <module path>` | `go test ./...` when tests exist | pkg.go.dev, from the module path | `go` |

Beyond the table, let language conventions decide what a reader needs:

- **PHP** — a library's quick start shows the public class and its namespace via
  a `use` statement, so the example is copy-pasteable. A framework package
  mentions the vendor publish or migration step only when the repository
  contains one. Version constraints come from `require`, never from the CI
  matrix alone.
- **Node CLI** — a `package.json` with a `bin` field installs the command it
  names, never `node bin/<file>.js`. Use the registry command
  (`npm install --global <name>`) only when publication is evidenced — a release
  workflow that publishes, existing docs, or a registry entry you read.
  Otherwise install from a checkout: clone the evidenced remote, then
  `npm install --global .` (the lock file's package manager equivalent when one
  is proven). The quick start then invokes the `bin` name.
- **Typed languages** — prefer an example that shows the types a caller gets
  back, when it costs no extra lines.
- **Applications of any language** — the quick start describes environment setup
  before the run command, using the documented env file, not a guessed one.

## Template

````markdown
<!-- header block: see "Header block" above for the logo variant -->

# <project name>

<!-- optional: 1-4 verified badges, from the evidence-policy templates -->

<Two or three concrete sentences: what the project does and who it is for.>

## Requirements

<!-- verified runtimes, tools and system requirements only -->

## Installation

```text
<verified install command>
```

## Configuration

<!-- existing config keys and env var names only; never real secrets -->

## Quick start

```<language>
<smallest verified example that produces a useful result>
```

## What it does

<!-- optional: capability list, only when the intro cannot carry it -->

## Documentation

<!-- link to separate documentation, if it exists -->

## Testing

```text
<verified test command>
```

## Upgrading

<!-- only when an upgrade guide or specific procedure exists -->

## Changelog

See [CHANGELOG](CHANGELOG.md).

## Contributing

See [CONTRIBUTING](CONTRIBUTING.md).

## Security

See [the security policy](SECURITY.md).

## Credits

<!-- verified names only, or a contributors link -->

## License

<short verified statement and a link to the license file>
````

## Match the project's actual logic

A README is in sync with the package only when its examples are the package's own
domain, not filler that would fit any project.

- Derive the quick start from what the public API is actually for. Read the entry
  points and the tests, find the call the package exists to make, and show that
  one first.
- When one API has several meaningful shapes, show two or three growing examples
  of the *same* API rather than one example per unrelated feature. Each should
  add exactly one idea over the previous.
- Name real domain concepts in prose. If the code models crawling, media
  conversions, or permissions, the intro says so in those words instead of
  "a powerful library".
- Cover a capability the code clearly centres on, even when it is unglamorous —
  a test/fake mode, a cancellation hook, or a concurrency knob belongs in the
  README when the API exposes it prominently.
- Skip sections the domain does not support. A pure computation library has no
  Configuration section; a CLI wrapper has no API section.
- When an example needs setup the package itself performs (a facade, a service
  provider, a client object), show that line — an example a reader cannot run is
  not evidence-backed usage.

## Adapting per project type

- **Simple library** — `What it does` can collapse into the intro paragraph and
  the first example.
- **Documented package** — when a separate documentation site is authoritative
  for installation and usage, keep the main install command and the first
  example, and link the docs for everything else instead of duplicating them.
- **Application** — the quick start must describe a verified path from a clean
  environment to a first run.
- **CLI** — show the real install command, the smallest verified invocation, and
  the help command (`<bin> --help`) as the pointer to the full option list. Never
  transcribe the help output: no `Options` or `Usage` section copying it, and at
  most the options the quick start itself uses.
- **Monorepo** — explain the purpose of the whole, then link to each package
  README. Never mix per-package commands into the root instructions.
- **No documentation site** — the README must carry a sufficient quick start
  itself. Do not send the reader off-repository without reason.

## Language and style

- Keep the language of a good existing README.
- For a new public open-source repository with no other instruction, use English.
- Write plainly: active voice, short paragraphs, no marketing filler.
- No emoji in headings, and none as decoration in prose.
- Use GitHub Flavored Markdown.
- Use GitHub admonitions only for genuinely important notes, warnings, or
  irreversible steps.
- Keep heading levels consistent; never repeat a section or a statement.
- Give every image meaningful alternative text.

## Deliberately not copied from reference projects

The structure above is inspired by well-maintained package READMEs, but the
following are project-specific and must never be carried over: support or
postcardware sections, advertising, sponsor links, alternative-project lists,
author names or emails, technology versions, and sample commands. Each of those
requires evidence in the target repository.
