---
name: github-readme-generator
description: Create or update a repository-root README.md from verified code, manifests, scripts, tests, workflows, and existing documentation. Use when a GitHub project needs an accurate, concise, maintainer-ready README without invented commands, badges, configuration, or claims.
---

# GitHub README generator

Produce a root `README.md` that a maintainer would sign off on: short, scannable,
trustworthy, and grounded entirely in what the repository actually contains.

The README is a landing page, not a copy of the documentation. It should carry a
reader from "what is this" to "first successful use" quickly, then hand off to
deeper docs and contributor information.

## When to use

Use for: creating a new root README, rewriting or refreshing an existing one,
filling in missing installation / usage / configuration / project links, or
auditing a README (and fixing it when the user asks for the fix).

Do not use for: full documentation sites or API references, authoring
`CONTRIBUTING.md` / `SECURITY.md` / `CHANGELOG.md` / licenses unless ordered
separately, marketing pages, release notes, general copywriting, or any change
to production code, configuration, or tests.

## Core constraints

1. **Repository first, prose second.** Never write a sentence before reading the
   sources that back it.
2. **Zero invention.** Any command, flag, env var, config key, public symbol,
   version, badge, link, author, license, or support claim that cannot be traced
   to the repository is omitted — not guessed. See `references/evidence-policy.md`.
3. **Conditional sections.** A section without verified content is dropped. Never
   emit empty headings or placeholders (`TODO` only when the user explicitly asks
   for a skeleton).
4. **Documentation-only diff.** Modify only the root `README.md`, or another file
   the user names. Never edit code, tests, manifests, workflows, or config to
   "match the README".
5. **No git side effects.** No staging, committing, pushing, or opening a PR
   unless the user explicitly asks. Preserve the user's existing working-tree changes.
6. **No secrets.** Document variable *names* from safe templates; never copy real
   values out of a local `.env` or environment.

## Workflow

### 1. Scan (always first)

Explore the working tree. With only a GitHub URL and no local checkout, use an
available read-only GitHub or web tool — do not clone, install plugins, or fetch
dependencies unless the environment already allows it without new permissions.

Read the relevant variants of:

- existing `README.md` and other root documents
- manifests and lock files (`composer.json`, `package.json`, `pyproject.toml`,
  `Cargo.toml`, `go.mod`, …)
- entry points and public API surface
- tests, examples, demo projects
- CI workflows and build configuration
- `.env.example`, config schemas, default configuration
- `LICENSE*`, `SECURITY*`, `CONTRIBUTING*`, `CHANGELOG*`, upgrade guides
- existing logo, banner, or documentation assets
- repository metadata, when a trustworthy source provides it

Build an internal claim → source map as you go. Anything that does not end up in
that map does not end up in the README.

### 2. Identify

Determine project type (library, application, CLI, service, monorepo, other),
primary audience, core value, README language, and whether the README is
self-contained or an entry point to separate documentation.

Ask the user only when identity or audience is genuinely ambiguous *and* the
choice materially changes the result. Otherwise take the best-evidenced reading
and state it in the handover summary.

### 3. Choose the mode

- **Create** — write a new README from verified information; omit what is missing
  and report it.
- **Update** — diff the README against the current repository. Keep valid
  branding, useful hand-written explanation, and working links. Fix only what is
  outdated, unsupported, duplicated, or badly ordered.
- **Audit** — analysis only. Write nothing. Return findings with sources and a
  recommended fix order. An audit never authorises a file change on its own.

### 4. Write

Follow the adaptive template and style rules in
`references/readme-structure.md`. Load it before drafting.

### 5. Validate and hand over

Run `references/validation-checklist.md` before finishing. Run any Markdown,
link, or doc-test check the environment safely allows; if none is available, say
so — never claim a check that did not run.

Close with a short handover summary: which kinds of files were inspected, which
commands and examples were verified, which checks ran, what could not be proven,
whether any `TODO` remains, and that nothing was committed or pushed unless
explicitly ordered.

## References

Load on demand, not up front:

- `references/readme-structure.md` — section order, adaptive template, per-project-type
  rules, language and style. Read before drafting.
- `references/evidence-policy.md` — what counts as evidence, commands and examples,
  badges and visual header, security and change scope. Read while scanning and
  whenever a claim feels unsupported.
- `references/validation-checklist.md` — pre-handover checks and the handover
  summary shape. Read before finishing.
