# Contributing

Thanks for considering a contribution.

## The canonical skill lives in one place

`skills/github-readme-generator/` is the only copy of the skill. Everything else
— the Claude Code and Codex plugin manifests, the two marketplace catalogs —
points at it. Never add a second copy for
another host; the whole distribution model depends on there being exactly one.

`skills/github-readme-generator/LICENSE.md` is a deliberate copy of the root
`LICENSE.md`. Installers copy only the skill directory, and MIT requires the
copyright notice to travel with every copy — so when one changes, change both.

## Making a change

1. Fork the repository and branch off `master`.
2. Edit `skills/github-readme-generator/`. Keep `SKILL.md` short — detail belongs
   in `references/`, which load only when the agent needs them.
3. When you change a rule, change it everywhere it appears. A rule stated in
   `SKILL.md` and contradicted in a reference is worse than no rule.
4. Update `CHANGELOG.md` under an `Unreleased` heading.

## Verifying

```text
claude plugin validate .
npx skills add . --list
diff LICENSE.md skills/github-readme-generator/LICENSE.md
node --test tests/evals/*.test.mjs
```

The first validates the Claude Code plugin and marketplace manifests. The second
confirms the skill is still discoverable and prints the description agents match
against — the frontmatter that decides whether the skill ever activates. The
third must print nothing. The fourth checks the benchmark scorer and every
fixture's ground truth; it needs Node.js 20 or newer and no network.

Changes to the skill's behaviour should also be exercised against
[`tests/scenarios.md`](tests/scenarios.md). Run the affected scenario in a clean
session and check both halves: that the skill activated at the right moment, and
that its output satisfies the invariants. Record which host you used — the
scenarios expect Claude Code, Codex, and Cursor, and noting an unavailable host
is more useful than leaving the cell blank.

A change meant to make the skill *more accurate*, rather than merely different,
belongs in the benchmark: [`tests/evals/README.md`](tests/evals/README.md)
explains how to run it, how the scoring works, and how to add a scenario. Its one
publishing rule is that the root README may cite a number only from a run
recorded under `tests/evals/results/`, naming the run id.

## Commit messages

Write the subject as an imperative sentence describing the outcome, without a
type prefix: `Order Configuration before Quick start`, not `fix: reorder`.

## Releasing

Maintainers only. Bump `version` in all three places — `.claude-plugin/plugin.json`,
the plugin entry in `.claude-plugin/marketplace.json`, and `.codex-plugin/plugin.json`
— then:

```text
claude plugin tag --push -m "Release %s"
```

The command refuses to tag when the two versions disagree. Installed copies stay
on their current version until their owner runs `claude plugin marketplace
update pekral` and `claude plugin update github-readme-generator`.
