# Section split

Load after drafting, before writing anything. A section that has grown into a
catalogue — a skill list, a rule set, a command reference — moves to its own
page under `docs/`, and the README keeps a short summary that links to it.

The gate reads each section as already composed. It never changes which
sections are composed or what they say; it only decides where a section lives.
In audit mode it writes nothing and reports which sections would move, to which
page.

## The gate

A section is one `##` heading and everything up to the next `##`. Measure it as
it would be written, before it is written.

### Never moved

- **The install path** — `Requirements`, `Installation`, `Configuration`, and
  `Quick start`. The reader's first successful use must stay in the README. When
  one of them trips a threshold, trim it with the rules in
  `readme-structure.md` instead, and name it in the handover summary.
- **The header, the intro, and `License`.**
- **Prose with no repeating structure** — a section that holds no table, no
  list, and fewer than two subsections stays, however long it is. A long
  narrative is not a catalogue.

### Moved

Any other section moves when it meets **either** condition.

- **Size** — more than **60 non-blank lines**, heading included.
- **Complexity** — a repeating structure long enough to need navigation of its
  own:
  - a table with more than **15 data rows**, or a list with more than 15 items;
  - three or more subsections that each carry a table or a list;
  - subsections nested two levels below the section (`####` inside `##`).

A section below both thresholds is written exactly as composed — byte for byte
what the generator would write without this gate.

### Why these numbers

- **60 lines.** The structure guide puts a whole simple README at 100–200 lines.
  A 60-line section is more than half of the shortest one and nearly a third of
  the longest, so a reader looking for the next section scrolls past a document
  of its own. The case that prompted this gate — the skill catalogue and rule
  overview of an agent-workflow package — took 150 lines of a 443-line README,
  75 lines each; both clear 60 comfortably, while the sections a README is meant
  to carry (`Testing`, `Documentation`, a short `What it does`) stay well under.
- **15 rows.** Fifteen rows is roughly what a reader takes in at a glance on one
  screen. The two tables in that case held 55 and 27 rows; a badge row, an
  options table, or a version matrix stays below 15. The list limit matches the
  table limit so that the same catalogue is not judged differently for being
  written as a list.
- **Three subsections, or two levels of nesting.** Either means the section has
  groups a reader must navigate between — which is what a page's own index is
  for.

When the repository shows a reason to depart from a number — a README the
maintainers keep long on purpose, documented in their contributing guide —
follow the repository and say so in the handover summary.

## Build the page — restructure, never paste

The page holds the same facts as the section, organised for a page of its own.
Add nothing the section did not carry; the evidence policy applies unchanged.

1. **Title** — the section heading becomes the page's only `#` heading.
2. **Intro** — one paragraph under the title saying what the page holds, in the
   section's own terms.
3. **Index** — when the page carries three or more groups (`##` headings after
   promotion), a table of the groups, each linking to its anchor, with the
   number of entries in it: the data rows of its table, or the items of its
   list. Two groups or fewer need no index.

   ```markdown
   | Group | Entries |
   | --- | --- |
   | [Code review](#code-review) | 12 |
   | [Testing](#testing) | 7 |
   | [Git](#git) | 9 |
   ```

4. **Headings** — every subsection moves up one level: `###` becomes `##`,
   `####` becomes `###`. The page ends with exactly one `#`, and no heading
   skips a level. Lines inside fenced code blocks are not headings.
5. **Relative links and images** — rewrite each one so it reaches the same file
   from `docs/`:
   - a path from the repository root gains `../`: `](skills/x/)` becomes
     `](../skills/x/)`;
   - a path already inside `docs/` drops the prefix: `](docs/usage.md)` becomes
     `](usage.md)`;
   - an anchor to a heading that moved with the section stays as it is —
     promotion changes the level, not the heading text, so the anchor is the
     same;
   - an anchor to a heading that stayed in the README points back at it:
     `](#installation)` becomes `](../README.md#installation)`;
   - absolute URLs are left alone.
6. **Links into the moved content** — a link elsewhere in the README that
   pointed at an anchor inside the moved section now points at the page:
   `](#rule-list)` becomes `](docs/rules.md#rule-list)`. Every link that reached
   a real target before the move reaches the same target after it. Other files
   are outside the diff, so a link in them that pointed at a moved anchor —
   `README.md#rule-list` in `CONTRIBUTING.md` — is named in the handover summary
   with its file and line, not edited.

## Leave a summary in the README

The section keeps its heading and its place in the order. Under it go two to
four lines that tell a reader what is there without following the link:

- what the section covers, in the section's own terms;
- the scale, counted from the page: `55 skills in 9 groups`, `27 rule files`;
- the link to the page.

```markdown
## Skill catalog

55 skills for planning, code review, testing, and release work, grouped by the
stage of a task they serve. The [skill catalog](docs/skill-catalog.md) lists
each one with its trigger and a group index with counts.
```

A bare `See docs/skill-catalog.md.` is not a summary. Neither is a number
without a noun, or a scale the page does not bear out.
