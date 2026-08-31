#!/usr/bin/env node
import { titleCase } from '@acme/core';

process.stdout.write(`${titleCase(process.argv.slice(2).join(' '))}\n`);
