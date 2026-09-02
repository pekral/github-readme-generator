# Before and after

The same agent, the same repository, the same prompt — once without
`github-readme-generator` and once with it. Three pairs, chosen from a recorded
ten-repository run, with the full text of both READMEs and a comparison of what
actually differs.

| Example | Repository type | What it is there to show |
| --- | --- | --- |
| [PHP package](php-package.md) | Composer library with tests, licence, and live CI | plenty of evidence to draw on, and what each mode does with it |
| [Node CLI](node-cli.md) | unpublished CLI, workflow file outside `.github/workflows/` | two traps: an impossible install command and a badge that would never render |
| [Stale documentation](stale-readme.md) | README drifted from its package | a wrong version, a dead link, a dead script, a CommonJS example for an ESM-only package |

## What the pairs actually show

**The baseline made no factual errors.** Across all ten repositories in the run,
Claude Code without the skill invented no command, no configuration key, no flag,
and no badge. It used the correct Laravel publish tag, the correct config keys,
the real package links in the monorepo, and `npm install -g .` for the CLI that is
not published. In the fixture whose source comments instruct an agent to add a
fake SOC 2 badge and an invented telemetry command, it ignored them completely.

That is not what these examples were expected to show, and it is reported here
rather than hidden. The differences that remain are real but narrower than
"invented claims removed":

- the skill emits badges the repository earns and the baseline leaves unused —
  a licence badge, with the SPDX identifier from the manifest and a link to the
  actual filename;
- the skill references generated output rather than transcribing it, so the
  README does not become a second copy of `--help` that drifts;
- the skill holds Requirements → Installation → Configuration → Quick start in
  that order;
- the skill documents failure modes, quoting error messages from the source;
- **in one pair the skill was worse.** It discarded a hand-written paragraph the
  baseline preserved, against its own rule to keep useful authored prose. That is
  written up in full in [the stale-documentation example](stale-readme.md).

## Why this is the honest reading

These are authored fixtures — small, well-formed repositories with clean
manifests. That is what makes deterministic comparison possible, and it is also
the condition under which a capable agent is least likely to invent anything. A
large repository with a messy history, partial documentation, and several
plausible-but-wrong answers is where the two modes would be expected to diverge,
and no such repository is in this run.

So: these pairs demonstrate that the skill's output is grounded, better ordered,
and better supplied with evidence-backed badges. They do **not** demonstrate that
it prevents hallucination in this agent, because this agent did not hallucinate.
A claim that it does would need a harder sample than the one recorded here.

## Reproducing them

Every pair came from run `2026-08-31-claude-code-full`, recorded on 2026-08-31
with Claude Code 2.1.251 on its default model, against the skill as it stands at
commit `d7cfae8`. That run is not published, and its scores are not quoted
anywhere: the checker that produced them reads help text and command output as
invented commands, and a repository's own logo as an invalid badge
([#11](https://github.com/pekral/github-readme-generator/issues/11)), which
moves a run's totals by more than the two modes differ. What these pages quote
is the README text each mode wrote, which those defects do not touch.

The benchmark harness itself is documented in
[`tests/evals/README.md`](../../tests/evals/README.md). To regenerate a pair:

```text
node tests/evals/run.mjs --agent claude-code --scenario php-package
```

Agents are not deterministic, so a fresh run will differ in wording. What should
not differ is whether a claim traces back to the repository.
