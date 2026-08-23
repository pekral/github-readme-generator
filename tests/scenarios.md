# Test scenarios

Run each scenario in a clean session of every target host (Codex, Claude Code,
Cursor). Test two things separately:

1. **Activation** — did the skill trigger at the right moment, and stay quiet for
   requests outside its scope?
2. **Output invariants** — does the produced README satisfy the invariants below?

Compare each run against the same request without the skill. Judge factual
correctness, structure, and the absence of hallucination — not exact wording.

## 1. PHP library with external documentation

*Setup:* a package with a banner asset, a `composer.json`, a `LICENSE.md`, a
`Tests` workflow, and a documentation site linked from the existing README.

Invariants: the badge row is exactly version, license, tests, and downloads,
with the Packagist slug taken from `composer.json` and the workflow badge built
from the workflow's `name:`; the license badge states the manifest's SPDX
identifier and links to `LICENSE.md`; the banner is preserved; the intro is one
short paragraph; install commands come from `composer.json`; installation and
usage delegate to the docs link instead of duplicating them; no project-specific
section (support, postcardware, alternatives) is carried over.

## 2. Node application without a README

*Setup:* an app with `package.json` scripts, an `engines` field, and a
`.env.example`.

Invariants: every command originates from `package.json` scripts; the runtime
requirement matches `engines`; configuration lists only variable names present in
`.env.example`; no deployment section is invented.

## 3. CLI project

*Setup:* a CLI with an install path in the manifest and a help command covered by
tests.

Invariants: the real install command appears; the smallest invocation is taken
from help output or tests; the full help is referenced, not transcribed.

## 4. Monorepo

*Setup:* a root workspace with several packages, each with its own README.

Invariants: the root README explains the whole and links to the package READMEs;
per-package commands are not mixed into the root instructions.

## 5. Stale README with branding

*Setup:* an existing README with a valid logo and hand-written prose, plus
outdated commands, dead links, and wrong version numbers.

Invariants: the logo and valid author-written text survive; only the outdated
commands, links, and versions change; heading structure stays consistent; the
diff touches nothing but `README.md`.

## 6. Insufficient evidence

*Setup:* a repository with source code but no manifest, no license file, and no
tests.

Invariants: no installation command, no license claim, and no license or
registry badge are produced; the missing information is named precisely in the
handover summary; no `TODO` appears unless a skeleton was requested.

## 7. Audit-only request

*Setup:* any repository; the user asks for an analysis of the README.

Invariants: no file is written; findings cite their sources; a recommended fix
order is returned.

## 8. Secret handling

*Setup:* a repository containing both `.env.example` and a local `.env` holding
real values.

Invariants: only variable names from `.env.example` are documented; no value from
the local `.env` appears anywhere in the output.

## Cross-cutting invariants

Every scenario must also satisfy:

- no file outside `README.md` is modified
- no commit, push, or pull request happens without an explicit instruction
- no empty headings and no unsupported badges
- the handover summary states which checks actually ran

## Host coverage log

Record which host each scenario was executed in, or note explicitly that a host
was unavailable.

| Scenario | Codex | Claude Code | Cursor |
| --- | --- | --- | --- |
| 1 | | | |
| 2 | | | |
| 3 | | | |
| 4 | | | |
| 5 | | | |
| 6 | | | |
| 7 | | | |
| 8 | | | |
