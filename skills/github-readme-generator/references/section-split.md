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
