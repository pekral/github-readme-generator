// Minimal build step: the package ships plain ESM, so this only checks it parses.
import { slugify } from '../src/index.js';

if (slugify('build check') !== 'build-check') {
  throw new Error('Build check failed.');
}
