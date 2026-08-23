# README structure

Load before drafting. The order below is the default reading path for a new
user, not a mandatory list of headings. Drop any section you cannot back with
evidence.

## Default order

1. optional logo or light/dark banner
2. title phrased as a benefit (or the project name, when identity requires it)
3. one to four verified badges
4. one short paragraph: what it does, for whom, why it helps
5. `What it does` — short capability list, only when it aids orientation
6. `Requirements` — verified runtimes, tools, system prerequisites
7. `Installation` — verified install command
8. `Quick start` — smallest verified example with a useful result
9. `Configuration` — existing config keys and env var names, never real secrets
10. `Documentation` — link to separate docs, when they exist
11. `Testing` — verified test command
12. `Upgrading` — only with an existing upgrade guide or specific procedure
13. `Changelog`, `Contributing`, `Security` — link the files that exist
14. `Credits` — verified names, or a contributors link
15. `License` — short verified statement plus a link to the license file

`Support`, `Sponsors`, `Alternatives`, `Roadmap`, `Deployment`, `API`, and
`Architecture` are optional. Add one only when it matters for this project and
the repository supports it.

## Template

````markdown
<!-- optional: existing logo or light/dark banner -->

# <short benefit or project name>

<!-- optional: 1-4 verified badges -->

<One short paragraph: what the project does, who it is for, why it is useful.>

## What it does

<!-- optional: short list of the main capabilities -->

## Requirements

<!-- verified runtimes, tools and system requirements only -->

## Installation

```text
<verified install command>
```

## Quick start

```<language>
<smallest verified example that produces a useful result>
```

## Configuration

<!-- existing config keys and env var names only; never real secrets -->

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

## Adapting per project type

- **Simple library** — `What it does` can collapse into the intro paragraph and
  the first example.
- **Documented package** — when a separate documentation site is authoritative
  for installation and usage, shorten those sections to a clear link instead of
  duplicating the docs.
- **Application** — the quick start must describe a verified path from a clean
  environment to a first run.
- **CLI** — show the real install command, the smallest verified invocation, and
  a pointer to the full help output.
- **Monorepo** — explain the purpose of the whole, then link to each package
  README. Never mix per-package commands into the root instructions.
- **No documentation site** — the README must carry a sufficient quick start
  itself. Do not send the reader off-repository without reason.

## Language and style

- Keep the language of a good existing README.
- For a new public open-source repository with no other instruction, use English.
- Write plainly: active voice, short paragraphs, no marketing filler.
- Let the title describe the outcome or purpose rather than repeating the package
  name, when the project's identity allows it.
- Use emoji sparingly or not at all.
- Use GitHub Flavored Markdown.
- Use GitHub admonitions only for genuinely important notes, warnings, or
  irreversible steps.
- Keep heading levels consistent; never repeat a section.
- Give every image meaningful alternative text.

## Deliberately not copied from reference projects

The structure above is inspired by well-maintained package READMEs, but the
following are project-specific and must never be carried over: support or
postcardware sections, advertising, sponsor links, alternative-project lists,
author names or emails, technology versions, and sample commands. Each of those
requires evidence in the target repository.
