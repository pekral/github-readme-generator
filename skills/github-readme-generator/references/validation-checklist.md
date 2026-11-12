# Validation checklist

Load before handing over. Work through every item; an item you cannot verify
becomes a line in the handover summary.

## Checks

1. Every command exists in a source and is reproduced exactly.
2. Every public symbol used in an example exists in the current code or tests.
3. Every relative path and referenced root file exists.
4. Every badge matches a real package, workflow, license, or service of this
   project, and points at the current branch. A license badge names the SPDX
   identifier the repository actually states and links to the real license
   filename; a published package carries its badge, and so does a CI workflow
   whose `on:` triggers can produce a run on the default branch — a workflow that
   cannot is left without one.
5. Stated runtime and framework versions agree with the manifests and CI.
6. No duplicated sections and no inconsistent heading levels. Section names
   match `readme-structure.md` verbatim (`Quick start`), no heading carries an
   emoji, and no horizontal rule separates sections.
7. No placeholders, unless the user explicitly requested a `TODO` skeleton.
8. No example contains a real secret or personal data taken from the local
   environment.
9. The document reads in order: identity → first successful use → contributor
   information, with Requirements, Installation, Configuration and Quick start
   consecutive and unbroken. The title is the project name, the intro is two or
   three sentences, `Installation` shows the main install command itself, and a
   warning about overwritten files sits next to its command.
10. No sentence merely announces the block below it, and nothing is stated twice
    in two sections.
11. The diff touches only documentation, within the agreed scope.
12. Every section outside the install path was run through the gate in
    `section-split.md`. Each moved section left a summary of two to four lines
    with its scale and a link; each new page has exactly one `#`, an intro, an
    index when it has three or more groups, and no skipped heading level; every
    relative link in it and every link into it resolves; no page that existed
    before this run was overwritten.

Run any Markdown, link, or documentation test the environment safely allows. If
none is available, say so in the summary rather than implying a check ran.

## Handover summary

Report, briefly:

- which kinds of files were inspected (representative sources, not an exhaustive
  file list)
- which commands and examples were verified, and against what
- which checks were actually run
- which information could not be proven, and what was therefore omitted —
  including any badge dropped because its workflow cannot run on the default
  branch, stated as the reason alone, never with a proposal to move, rename, or
  edit the workflow file, and any manifest description the repository contradicts, quoted
  alongside the source that refutes it
- which sections moved to which pages, and any section that tripped the gate
  but stayed — an install-path section, or a page that already existed
- whether any `TODO` remains
- that nothing was staged, committed, or pushed — unless the user ordered it

Name every unresolved uncertainty. Do not pad the summary with the full list of
files you read.
