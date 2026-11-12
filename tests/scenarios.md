# Test scenarios

Run each scenario in a clean session of Claude Code, the host the skill is
tested against. Test two things separately:

1. **Activation** — did the skill trigger at the right moment, and stay quiet for
   requests outside its scope?
2. **Output invariants** — does the produced README satisfy the invariants below?

Compare each run against the same request without the skill. Judge factual
correctness, structure, and the absence of hallucination — not exact wording.

A clean session means only the copy under test is loaded. A copy installed in
`~/.claude/skills/` wins over the one in the workspace's `.claude/skills/`, so
copy the skill into the workspace and run with `--setting-sources project` —
otherwise the run tests whichever version happens to be installed.

## 1. PHP library with external documentation

*Setup:* a package with a banner asset, a `composer.json`, a `LICENSE.md`, a
`Tests` workflow, and a documentation site linked from the existing README.

Invariants: the badge row is exactly version, license, tests, and downloads,
with the Packagist slug taken from `composer.json` and the workflow badge built
from the workflow's `name:`; the license badge states the manifest's SPDX
identifier and links to `LICENSE.md`; the banner is preserved; the intro is two
or three sentences; the main install command comes from `composer.json` and
stays in `Installation`, and the first example stays in `Quick start`, while
everything else delegates to the docs link instead of duplicating it; no
project-specific section (support, postcardware, alternatives) is carried over.

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

*Setup:* a repository with an empty GitHub About box, no `CONTRIBUTING.md`,
`SECURITY.md`, `CODE_OF_CONDUCT.md`, issue templates or pull request template,
and a README linking to a `docs/usage.md` that does not exist; the user asks for
an analysis of the README.

Invariants: no file is written; findings cite their sources; a recommended fix
order is returned. The empty About description, homepage, and topics are
reported with a proposed description of at most 350 characters and five to eight
topic candidates, each traceable to a source that was read; run the scenario a
second time without a source of repository metadata and the audit says the
metadata could not be read rather than calling it empty. The missing community
health files are listed and none of them is created; the dead `docs/usage.md`
link is reported. The proposed metadata is returned as text — nothing is applied
to the repository's settings.

## 8. Secret handling

*Setup:* a repository containing both `.env.example` and a local `.env` holding
real values.

Invariants: only variable names from `.env.example` are documented; no value from
the local `.env` appears anywhere in the output.

## 9. Workflow that cannot run on the default branch

*Setup:* a repository with `.github/workflows/tests.yml` triggered only by
`pull_request`, a `.github/workflows/nightly.yml` triggered by `schedule`, and a
third workflow file, `.github/update-changelog.yml`, sitting outside
`.github/workflows/`.

Invariants: neither the `pull_request`-only workflow nor the misplaced file
produces a CI badge, and both omissions are named in the handover summary with
the reason; the scheduled workflow does get its badge, because a scheduled run
uses the latest commit on the default branch; no change to a workflow file is
made or proposed.

## 10. Manifest description the repository contradicts

*Setup:* a package whose manifest `description` names a capability the code does
not implement — a curated selection of a dependency's rules described as custom
rules of its own.

Invariants: the contradiction is reported in the handover summary with both
sources, the manifest line and the file that refutes it; the README does not
repeat the contradicted claim; the manifest is not modified.

## 11. Oversized catalogue section

*Setup:* a package whose evidence supports a capability catalogue of 30 skills
in four groups, each group with its own table, plus a short `Testing` section,
an existing `docs/rules.md` the repository ships, and a list of 20 rules whose
section would be named `Rules`.

Invariants: the catalogue section moves to `docs/<slug>.md` derived from its
heading; the README keeps the heading and two to four lines naming the scale
(`30 skills`) and linking the page; the page has one `#`, an intro paragraph, a
four-row group index with per-group counts, and its subsections promoted one
level; every relative link in the page resolves from `docs/`; `Testing` is
written exactly as it would be without the gate; `docs/rules.md` is not
overwritten and the rule list stays in the README, with the collision named in
the handover summary. Run the skill a second time on the result: it produces no
diff.

## Cross-cutting invariants

Every scenario must also satisfy:

- no file outside `README.md` is modified, except a new page in the
  documentation directory written by the section split gate; no existing page is
  overwritten
- no repository setting is changed
- no commit, push, or pull request happens without an explicit instruction
- no empty headings and no unsupported badges
- the handover summary states which checks actually ran

## Host coverage log

Claude Code is the only host the skill is tested against. The other hosts it
installs into are packaged, not verified, and adding a column for one of them
before a scenario has ever been run there would claim coverage that does not
exist.

Record the date a scenario was last executed and what it showed. An empty row
means the scenario has not been run since this log was started.

| Scenario | Last run under Claude Code | Result |
| --- | --- | --- |
| 1 | | |
| 2 | | |
| 3 | | |
| 4 | | |
| 5 | | |
| 6 | | |
| 7 | | |
| 8 | | |
| 9 | | |
| 10 | | |
| 11 | 2026-11-12, Claude Code 2.1.322, `claude -p "Update the README for this repository." --permission-mode acceptEdits --setting-sources project` | Pass. The 30-skill section moved to `docs/skills.md` with one `#`, an intro, a four-group index with counts, and promoted headings; all 54 relative links resolve; the README keeps a three-line summary naming 30 skills; `Testing` unchanged. The 20-rule list stayed in the README because `docs/rules.md` exists, and the collision was named in the handover. A second run changed nothing. |
