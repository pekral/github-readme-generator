// Deterministic scorer: one generated README, one fixture ground truth, one findings document.
// No network, no model, no randomness — the same inputs always produce the same findings.

import { readFileSync, existsSync } from 'node:fs';
import { join, resolve, normalize } from 'node:path';
import { pathToFileURL } from 'node:url';

const SHELL_FENCES = new Set(['', 'text', 'sh', 'bash', 'zsh', 'shell', 'console', 'shell-session']);
const PROMPT_PREFIX = /^[$>❯]\s+/;

/** Every line of every shell-ish fenced block, normalised for comparison. */
export function extractCommands(markdown) {
  const commands = [];
  let fence = null;
  let lineNumber = 0;

  for (const line of markdown.split('\n')) {
    lineNumber += 1;
    const opening = line.match(/^\s*(`{3,}|~{3,})\s*([A-Za-z0-9+-]*)\s*$/);

    if (fence === null) {
      if (opening) fence = { marker: opening[1][0], language: opening[2].toLowerCase() };
      continue;
    }
    if (opening && opening[1][0] === fence.marker) {
      fence = null;
      continue;
    }
    if (!SHELL_FENCES.has(fence.language)) continue;

    const command = line.replace(PROMPT_PREFIX, '').trim().replace(/\s+/g, ' ');
    if (command !== '' && !command.startsWith('#')) commands.push({ command, line: lineNumber });
  }

  return commands;
}

const IMAGE = /!\[[^\]]*\]\(\s*(<[^>]+>|[^\s)]+)[^)]*\)/g;

/** Markdown images and HTML <img>, which is where badges live. */
export function extractImages(markdown) {
  const images = [];
  for (const match of markdown.matchAll(IMAGE)) {
    images.push(stripAngles(match[1]));
  }
  for (const match of markdown.matchAll(/<(?:img|source)\b[^>]*?\b(?:src|srcset)\s*=\s*["']([^"']+)["']/gi)) {
    images.push(match[1].trim());
  }
  return images;
}

/** Markdown links, excluding images. */
export function extractLinks(markdown) {
  const withoutImages = markdown.replace(IMAGE, '');
  const links = [];
  for (const match of withoutImages.matchAll(/\[[^\]]*\]\(\s*(<[^>]+>|[^\s)]+)[^)]*\)/g)) {
    links.push(stripAngles(match[1]));
  }
  for (const match of withoutImages.matchAll(/<a\b[^>]*?\bhref\s*=\s*["']([^"']+)["']/gi)) {
    links.push(match[1].trim());
  }
  return links;
}

function stripAngles(target) {
  const trimmed = target.trim();
  return trimmed.startsWith('<') && trimmed.endsWith('>') ? trimmed.slice(1, -1).trim() : trimmed;
}

function matchesAny(value, exact = [], patterns = []) {
  if (exact.includes(value)) return true;
  return patterns.some((pattern) => new RegExp(pattern).test(value));
}

function isExternal(target) {
  return /^[a-z][a-z0-9+.-]*:/i.test(target) || target.startsWith('//');
}

function resolvesInsideRepo(repoDir, target) {
  const path = decodeURI(target.split('#')[0].split('?')[0]);
  if (path === '') return true;
  const absolute = resolve(repoDir, normalize(path));
  if (!absolute.startsWith(resolve(repoDir))) return false;
  return existsSync(absolute);
}

/**
 * Score one README against one ground truth.
 * Returns findings plus the counts the benchmark table reports.
 */
export function score(markdown, truth, repoDir) {
  const findings = [];
  const add = (kind, detail, evidence) => findings.push({ kind, detail, evidence });

  const commands = extractCommands(markdown);
  for (const { command } of commands) {
    if (!matchesAny(command, truth.commands?.allowed ?? [], truth.commands?.allowedPatterns ?? [])) {
      add('invalidCommand', 'Command is not one the repository defines.', command);
    }
  }

  const images = extractImages(markdown);
  for (const image of images) {
    if (!matchesAny(image, truth.badges?.allowed ?? [], truth.badges?.allowedPatterns ?? [])) {
      add('invalidBadge', 'Badge is not backed by evidence in the repository.', image);
    }
  }

  const links = extractLinks(markdown);
  for (const link of links) {
    if (link.startsWith('#')) continue;
    if (isExternal(link)) {
      if (!matchesAny(link, truth.links?.allowedExternal ?? [], truth.links?.allowedExternalPatterns ?? [])) {
        add('brokenLink', 'External link is not one the repository points at.', link);
      }
      continue;
    }
    if (!resolvesInsideRepo(repoDir, link)) {
      add('brokenLink', 'Relative link has no target in the repository.', link);
    }
  }

  for (const rule of truth.forbidden ?? []) {
    const match = markdown.match(new RegExp(rule.pattern, rule.flags ?? 'i'));
    if (match) add(rule.kind ?? 'unsupportedClaim', rule.note, match[0]);
  }

  for (const rule of truth.required ?? []) {
    if (!new RegExp(rule.pattern, rule.flags ?? 'i').test(markdown)) {
      add('missingInformation', rule.note, rule.id);
    }
  }

  // One defect can trip two detectors: the allow-list rejects the whole command
  // `yarn add @acme/slugify`, and a forbidden rule matches `yarn add` inside it.
  // Keep the widest evidence for each kind so a mode is never charged twice for
  // the same text, while a claim made only in prose is still counted once.
  const unique = findings.filter((finding, index) => !findings.some((other, otherIndex) => (
    other.kind === finding.kind
    && otherIndex !== index
    && (other.evidence.includes(finding.evidence)
      && (other.evidence.length > finding.evidence.length || otherIndex < index))
  )));

  const counts = {
    unsupportedClaim: 0,
    invalidCommand: 0,
    invalidBadge: 0,
    brokenLink: 0,
    missingInformation: 0,
  };
  for (const finding of unique) counts[finding.kind] += 1;

  const checked = commands.length + images.length + links.length
    + (truth.forbidden?.length ?? 0) + (truth.required?.length ?? 0);
  const errors = unique.length;

  return {
    scenario: truth.scenario,
    counts,
    errors,
    checked,
    // Errors per verifiable statement. 0 is a README that invents nothing and omits nothing.
    hallucinationRate: checked === 0 ? 0 : Number((errors / checked).toFixed(4)),
    findings: unique,
  };
}

export function loadTruth(fixtureDir) {
  return JSON.parse(readFileSync(join(fixtureDir, 'truth.json'), 'utf8'));
}

export function scoreFile(readmePath, fixtureDir) {
  const truth = loadTruth(fixtureDir);
  return score(readFileSync(readmePath, 'utf8'), truth, join(fixtureDir, 'repo'));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const [readmePath, fixtureDir] = process.argv.slice(2);
  if (!readmePath || !fixtureDir) {
    console.error('Usage: node tests/evals/score.mjs <generated README.md> <fixture directory>');
    process.exit(2);
  }
  console.log(JSON.stringify(scoreFile(readmePath, fixtureDir), null, 2));
}
