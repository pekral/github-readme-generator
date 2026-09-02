# Contributing

Thanks for considering a contribution. Participation is held to the
[Code of Conduct](CODE_OF_CONDUCT.md).

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
node --test tests/repository.test.mjs
node --test tests/evals/*.test.mjs
```

The first validates the Claude Code plugin and marketplace manifests. The second
confirms the skill is still discoverable and prints the description agents match
against — the frontmatter that decides whether the skill ever activates.

The third checks the repository against its own claims: that the skill ships every
file it declares, that its licence copy still matches the root one, that every
relative link in the documentation resolves, that each test scenario has a host
coverage row, that each benchmark fixture has a repository and a ground truth, and
that the three manifests, the changelog and the git tags agree on one version. The
fourth checks the benchmark scorer and every fixture's ground truth.

CI runs the last two on every push and pull request, across Node.js 20 and 22.
Both need Node.js 20 or newer and no network. The first two need tooling a runner
does not have, so they stay local.

### Releasing a version

A released version must exist in three places that agree: the `version` field of
the three manifests, a dated section in `CHANGELOG.md`, and a `v`-prefixed git
tag. `tests/repository.test.mjs` fails when a tag has no changelog section, so a
tag pushed without its entry breaks the build rather than passing quietly.

While the project is in beta the version carries a `-beta.N` suffix and its
GitHub Release is marked as a pre-release, so nobody pins a stable version to
something that is not one.

Changes to the skill's behaviour should also be exercised against
[`tests/scenarios.md`](tests/scenarios.md). Run the affected scenario in a clean
session and check both halves: that the skill activated at the right moment, and
that its output satisfies the invariants. Record the run in the host coverage
log at the end of that file.

Claude Code is the host the skill is tested against. It is packaged for Codex,
Cursor, and everything else the `skills` CLI installs into, but nothing there
has been verified — so documentation may say the skill is *packaged for* those
hosts and must not say it is tested against them.

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
— move the unreleased changelog entries under a dated heading for that version,
then:

```text
claude plugin tag --dry-run
node --test tests/repository.test.mjs
git tag -a v1.2.3 -m "Release 1.2.3"
git push origin v1.2.3
gh release create v1.2.3 --verify-tag --notes-from-tag
```

`claude plugin tag --dry-run` reports whether the plugin manifest and the
marketplace entry agree, which is what makes it worth running. Do not let it
create the tag: it writes `github-readme-generator--v1.2.3`, and both the
changelog check in `tests/repository.test.mjs` and GitHub's own release list
expect the plain `v`-prefixed form.

Add `--prerelease` to `gh release create` while the version carries a `-beta.N`
suffix. Installed copies stay on their current version until their owner runs
`claude plugin marketplace update pekral` and `claude plugin update
github-readme-generator`.
