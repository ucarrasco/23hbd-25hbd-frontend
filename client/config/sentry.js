import * as Sentry from '@sentry/browser'

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.ACTUAL_ENV,
    debug: process.env.NODE_ENV === 'development'
  })

  Sentry.configureScope(
    scope => {
      scope.flavor = process.env.FLAVOR
    }
  )
}
