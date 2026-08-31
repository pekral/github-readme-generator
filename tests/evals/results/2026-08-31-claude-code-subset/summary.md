# Benchmark run `2026-08-31-claude-code-subset`

- Prompt: `Write the root README.md for this repository.`
- Model: agent default
- Skill commit: `89e591ed2923a69d63e1e7a4bef83bb055bc3777`
- Started: 2026-08-31T14:05:46.758Z

| Agent | Mode | Repositories | Unsupported claims | Invalid commands | Invalid badges | Broken links | Missing information | Hallucination rate |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| claude-code | baseline | 2 | 0 | 0 | 0 | 0 | 0 | 0 |
| claude-code | skill | 2 | 0 | 0 | 0 | 0 | 0 | 0 |

Hallucination rate is errors divided by verifiable statements (commands, badges, links, and
the ground truth required and forbidden checks). Lower is better; 0 means the README invented
nothing and omitted nothing the fixture proves.
