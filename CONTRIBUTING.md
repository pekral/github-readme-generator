# Contributing

Thanks for considering a contribution.

## The canonical skill lives in one place

`skills/github-readme-generator/` is the only copy of the skill. Everything else
— the plugin manifests, `install.sh` — points at it. Never add a second copy for
another host; the whole distribution model depends on there being exactly one.

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
./install.sh --check .agents/skills .claude/skills
```

The first validates the plugin and marketplace manifests. The second confirms an
installed copy still matches the source, and exits non-zero when it has drifted.

Changes to the skill's behaviour should also be exercised against
[`tests/scenarios.md`](tests/scenarios.md). Run the affected scenario in a clean
session and check both halves: that the skill activated at the right moment, and
that its output satisfies the invariants. Record which host you used — the
scenarios expect Claude Code, Codex, and Cursor, and noting an unavailable host
is more useful than leaving the cell blank.

## Commit messages

Write the subject as an imperative sentence describing the outcome, without a
type prefix: `Order Configuration before Quick start`, not `fix: reorder`.

## Releasing

Maintainers only. Bump `version` in both `.claude-plugin/plugin.json` and the
plugin entry in `.claude-plugin/marketplace.json`, then:

```text
claude plugin tag --push -m "Release %s"
```

The command refuses to tag when the two versions disagree. Installed copies stay
on their current version until their owner runs `claude plugin marketplace
update pekral` and `claude plugin update github-readme-generator`.
