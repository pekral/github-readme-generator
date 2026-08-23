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
   filename; a published package and a CI workflow each carry their badge.
5. Stated runtime and framework versions agree with the manifests and CI.
6. No duplicated sections and no inconsistent heading levels.
7. No placeholders, unless the user explicitly requested a `TODO` skeleton.
8. No example contains a real secret or personal data taken from the local
   environment.
9. The document reads in order: identity → first successful use → contributor
   information, with Requirements, Installation, Quick start and Configuration
   consecutive and unbroken.
10. No sentence merely announces the block below it, and nothing is stated twice
    in two sections.
11. The diff touches only documentation, within the agreed scope.

Run any Markdown, link, or documentation test the environment safely allows. If
none is available, say so in the summary rather than implying a check ran.

## Handover summary

Report, briefly:

- which kinds of files were inspected (representative sources, not an exhaustive
  file list)
- which commands and examples were verified, and against what
- which checks were actually run
- which information could not be proven, and what was therefore omitted
- whether any `TODO` remains
- that nothing was staged, committed, or pushed — unless the user ordered it

Name every unresolved uncertainty. Do not pad the summary with the full list of
files you read.
