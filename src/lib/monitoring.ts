// Error tracking (Sentry; sends no personal details by default). Does nothing until VITE_SENTRY_DSN is set at build time,
// and loads the Sentry code only in that case.
export function initMonitoring() {
  const dsn = import.meta.env.VITE_SENTRY_DSN as string | undefined;
  if (!dsn || !import.meta.env.PROD) return;

  import('@sentry/react').then((Sentry) => {
    Sentry.init({
      dsn,
      tracesSampleRate: 0,     // errors only, no performance tracing
    });
  }).catch(() => {});
}
