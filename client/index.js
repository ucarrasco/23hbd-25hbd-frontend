import './polyfills'
import 'config/i18n'
import 'config/sentry'
import React from 'react'
import {render} from 'react-dom'
import store from './store'
import App from 'components/App'
import { Provider } from 'react-redux'
import { Router } from 'react-router'
import history from 'config/history'
import { ApolloProvider } from "@apollo/react-hooks"
import apolloClient from 'config/apolloClient'
import { ToastContainer } from 'react-toastify'
import toastifyOptions from 'config/toastify'
import { detect } from 'detect-browser'
import ErrorsCatcher from './utils/ErrorsCatcher'
import ReactGA from 'react-ga'
import moment from 'moment'
import migrateToCookieTokenIfNeeded from 'utils/migrateToCookieTokenIfNeeded'
import i18n from 'i18next'

require("./config/toastify") // config toasts
require("./styles/styles.scss")
import 'react-photoswipe/lib/photoswipe.css'

moment.locale(i18n.language)
migrateToCookieTokenIfNeeded()

if (process.env.NODE_ENV === 'production' && process.env.ACTUAL_ENV === 'production') {
  ReactGA.initialize(process.env.ANALYTICS_ID)
  ReactGA.pageview(window.location.pathname + window.location.search)
}

const detectedBrowser = detect()
if (detectedBrowser && detectedBrowser.name === "ie") // got a `Cannot read property 'name' of null` sentry issue from a opera user :/
  document.body.classList.add("ie")

const appContainer = document.createElement('div')
appContainer.id = "app"
document.body.appendChild(appContainer)

function renderApp(App) {
  render(
    <ErrorsCatcher>
      <Provider store={store}>
        <ApolloProvider client={apolloClient}>
          <Router history={history}>
            <App />
          </Router>
          <ToastContainer {...toastifyOptions} />
        </ApolloProvider>
      </Provider>
    </ErrorsCatcher>,
    appContainer
  )
}

renderApp(App)

if (module.hot) {
  module.hot.accept('./components/App', _ => {
    let UpdatedApp = require('./components/App').default
    renderApp(UpdatedApp)
  })
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
}
