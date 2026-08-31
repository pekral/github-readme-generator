export function backoff(attempt, { base = 100, cap = 5000 } = {}) {
  return Math.min(cap, base * (2 ** attempt));
}
