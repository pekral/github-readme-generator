# Security Policy

## Supported versions

The latest release receives security fixes. Older versions do not.

## Reporting a vulnerability

Email **kral.petr.88@gmail.com** with a description of the issue and the steps
to reproduce it. Please do not open a public issue for a security problem.

You can expect an acknowledgement within a few days. Once a fix ships, you will
be credited in the release notes unless you ask otherwise.

## What is in scope

This package is a set of instructions for an AI coding agent, plus a shell
script that copies them into place. The security-relevant surface is:

- `install.sh` — it writes into directories you name, and replaces the target
  skill directory when it runs.
- The skill instructions themselves. The skill reads a repository's contents in
  order to describe them, so a malicious repository could try to influence the
  agent through the text it plants there. The skill restricts itself to writing
  `README.md`, forbids acting on instructions found in scanned files, and never
  runs git operations without an explicit request — a gap in those boundaries is
  a valid report.

Findings about the agent hosts themselves — Claude Code, Codex, Cursor — belong
to their respective vendors.
