import React from 'react'
import * as Sentry from '@sentry/browser'

class ErrorsCatcher extends React.Component {

  componentDidCatch(error, errorInfo) {
    Sentry.withScope(scope => {
      Object.keys(errorInfo).forEach(key => {
        scope.setExtra(key, errorInfo[key])
      })
      Sentry.captureException(error)
    })
  }

  render() {
    return this.props.children
  }
}

export default ErrorsCatcher
