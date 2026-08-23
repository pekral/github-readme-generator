# Evidence policy

Load while scanning the repository, and whenever a sentence you are about to
write is not obviously traceable to a source.

## The rule

Every concrete statement in the README must map to something in the repository.
If you cannot point at the file that proves it, it does not go in.

Never invent:

- an installation or run command
- a CLI flag
- an environment variable or a sample secret value
- a configuration key
- a public method, class, or return type
- a supported runtime or framework version
- a badge or a workflow
- a documentation, sponsor, or contact link
- an author, credit, license, support status, or roadmap

When a fact is unverifiable, omit it and name the gap in the handover summary.
Insert `TODO` only when the user explicitly asked for a skeleton whose unproven
spots must be marked.

## What counts as evidence

| Claim | Acceptable source |
| --- | --- |
| Install / run / test command | manifest scripts, Makefile, CI workflow, existing docs, captured tool output |
| Runtime or framework version | manifest constraints, CI matrix, engine fields, lock files |
| Public API in an example | current source, tests, shipped examples |
| Config key or env var | config files, config schema, `.env.example`, code that reads it |
| Badge | package registry entry, release source, CI workflow file, coverage service config, license file |
| License | `LICENSE*` file, manifest license field |
| Credits | `CONTRIBUTING*`, existing credits, repository contributors |
| Related document link | the file actually present in the repository |

Repository metadata (description, topics, homepage) counts only when it comes
from a trustworthy source you actually read.

## Commands and examples

- Copy commands exactly as the source defines them. Do not normalise, shorten,
  or "improve" them.
- Example code must match the current public API, and should be derived from
  tests or shipped examples where possible.
- Keep examples minimal but complete enough to produce a first successful result.
- Match the syntax-highlighting language to the block's actual language.
- You may run an existing check when it needs no dependency install and mutates
  nothing. Installing, downloading, or otherwise mutating the project requires
  explicit permission.

## Badges and visual header

- Use only badges backed by a real package registry, release source, CI
  workflow, coverage service, or license.
- Both the badge link and the badge image must point at the correct project and
  the current branch or workflow.
- Prefer at most four meaningful badges. Add more only with obvious reader value.
- Never put dynamic numbers (stars, downloads) into prose.
- Reuse an existing logo or banner when it clearly belongs to the project. Never
  generate a new one unless asked.
- When light and dark variants exist, use an accessible `<picture>` block.

## Security and change scope

- Only the root `README.md` may change, or a file the user explicitly named.
- Never edit production code, tests, manifests, workflows, or configuration to
  make them agree with the README.
- Never write secrets, and never lift real values from a local `.env` into
  documentation. Document variable names from safe templates instead.
- Never stage, commit, push, or open a pull request without an explicit
  instruction.
- Never add an external tracker, analytics, badge service, or promotional
  content without evidence and a matching request.
- Preserve any pre-existing changes in the user's working tree.
