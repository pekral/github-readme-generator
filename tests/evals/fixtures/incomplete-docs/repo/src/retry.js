import { backoff } from './backoff.js';

export async function retry(operation, { attempts = 3, token } = {}) {
  let lastError;

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    token?.throwIfCancelled();
    try {
      return await operation(attempt);
    } catch (error) {
      lastError = error;
      await new Promise((resolve) => { setTimeout(resolve, backoff(attempt)); });
    }
  }

  throw lastError;
}
