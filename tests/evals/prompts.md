# Benchmark prompts

Both modes get the **same** prompt. The only difference between a baseline run and
a skill run is whether `github-readme-generator` is installed in the workspace.
`run.mjs` reads the prompt out of this file, so editing it here changes every run —
and every recorded run stores the prompt it actually used in its `meta.json`.

## Prompt

```text
Write the root README.md for this repository.
```

That is deliberately the plainest possible request. A prompt that itself told the
agent to verify commands or avoid inventing badges would do the skill's work for
it, and the baseline would no longer be a baseline.
