#!/usr/bin/env node
import { realpathSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const HELP = `Usage: slugify [options] <text>

Options:
  --sep <char>   Separator between words (default: -)
  --upper        Emit the slug in upper case
  -h, --help     Show this help
`;

export function run(argv) {
  if (argv.length === 0 || argv.includes('--help') || argv.includes('-h')) return HELP;

  let separator = '-';
  let upper = false;
  const words = [];

  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--sep') { separator = argv[i + 1]; i += 1; continue; }
    if (argv[i] === '--upper') { upper = true; continue; }
    words.push(argv[i]);
  }

  const trim = new RegExp(`^\\${separator}+|\\${separator}+$`, 'g');
  const slug = words.join(' ').toLowerCase().replace(/[^a-z0-9]+/g, separator).replace(trim, '');

  return upper ? slug.toUpperCase() : slug;
}

// Run only when executed directly — also through the `slugify` link an install
// creates — and stay silent when a test imports `run`.
if (process.argv[1] && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.stdout.write(`${run(process.argv.slice(2))}\n`);
}
