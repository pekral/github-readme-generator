import { palette } from '../src/index.js';

if (palette('#336699').length !== 5) throw new Error('Build check failed.');
