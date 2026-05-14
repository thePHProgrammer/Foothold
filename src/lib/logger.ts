/**
 * Thin logging abstraction.
 * Replace console.* with Sentry / Axiom / Logtail / Datadog
 * in production without touching call sites.
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug'

interface LogEntry {
  level: LogLevel
  message: string
  context?: Record<string, unknown>
  timestamp: string
}

function log(level: LogLevel, message: string, context?: Record<string, unknown>) {
  const entry: LogEntry = {
    level,
    message,
    context,
    timestamp: new Date().toISOString(),
  }

  if (process.env.NODE_ENV === 'development') {
    const prefix = `[${entry.timestamp}] [${level.toUpperCase()}]`
    if (level === 'error') console.error(prefix, message, context ?? '')
    else if (level === 'warn') console.warn(prefix, message, context ?? '')
    // eslint-disable-next-line no-console
    else console.log(prefix, message, context ?? '')
  } else {
    // TODO: Replace with structured logging service (Axiom, Logtail, etc.)
    if (level === 'error') console.error(JSON.stringify(entry))
    else if (level === 'warn') console.warn(JSON.stringify(entry))
    // eslint-disable-next-line no-console
    else console.log(JSON.stringify(entry))
  }
}

export const logger = {
  info: (message: string, context?: Record<string, unknown>) => log('info', message, context),
  warn: (message: string, context?: Record<string, unknown>) => log('warn', message, context),
  error: (message: string, context?: Record<string, unknown>) => log('error', message, context),
  debug: (message: string, context?: Record<string, unknown>) => {
    if (process.env.NODE_ENV === 'development') log('debug', message, context)
  },
}
