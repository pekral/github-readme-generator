# Benchmark run `2026-08-31-claude-code-full`

- Prompt: `Write the root README.md for this repository.`
- Model: agent default
- Skill commit: `ae865c75af790edae74e5c6e025232b5972ad29a`
- Started: 2026-08-31T16:43:31.114Z

| Agent | Mode | Repositories | Unsupported claims | Invalid commands | Invalid badges | Broken links | Missing information | Hallucination rate |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| claude-code | baseline | 10 | 0 | 19 | 1 | 0 | 1 | 0.1963 |
| claude-code | skill | 10 | 0 | 15 | 1 | 0 | 2 | 0.1593 |

Hallucination rate is errors divided by verifiable statements (commands, badges, links, and
the ground truth required and forbidden checks). Lower is better; 0 means the README invented
nothing and omitted nothing the fixture proves.
