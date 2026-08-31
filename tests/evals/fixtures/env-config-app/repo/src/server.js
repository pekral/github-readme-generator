import { createServer } from 'node:http';
import { loadConfig } from './config.js';

const config = loadConfig();

createServer((request, response) => {
  response.end(`acme-invoices at ${config.appUrl}\n`);
}).listen(3000);
