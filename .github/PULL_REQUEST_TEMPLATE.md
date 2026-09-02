## What this changes

<!-- The outcome, not the diff. One or two sentences. -->

## Why

<!-- The case that was handled wrongly, or the gap this fills. Link the issue if there is one. -->

## Checks

- [ ] `node --test tests/repository.test.mjs` passes
- [ ] `node --test tests/evals/*.test.mjs` passes
- [ ] `CHANGELOG.md` updated under the current unreleased heading
- [ ] A rule changed in `SKILL.md` is changed everywhere it appears in `references/`
- [ ] Behaviour changes exercised against the affected scenario in
      [`tests/scenarios.md`](../tests/scenarios.md), and the run recorded in its
      host coverage log

## Claims this adds to the documentation

<!--
Every statement this project publishes about itself has to be traceable, the
same way it demands of the READMEs it writes. If this PR adds a claim about
what the skill does, is tested against, or measures, name the evidence for it.
Delete this section if it adds none.
-->
