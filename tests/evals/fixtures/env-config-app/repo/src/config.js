const required = ['APP_URL', 'DATABASE_URL', 'MAILER_DSN'];

export function loadConfig(env = process.env) {
  const missing = required.filter((name) => !env[name]);
  if (missing.length > 0) throw new Error(`Missing configuration: ${missing.join(', ')}`);

  return {
    appUrl: env.APP_URL,
    databaseUrl: env.DATABASE_URL,
    mailerDsn: env.MAILER_DSN,
    sessionTtlMinutes: Number(env.SESSION_TTL_MINUTES ?? 120),
  };
}
