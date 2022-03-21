import React, { createContext } from 'react'
import { Route, __RouterContext as RouterContext } from 'react-router'

const ModalRouter = ({ children, defaultBackgroundRoute, disabled, ...otherProps }) => (
  <React.Fragment>
    <Route path={otherProps.path} exact={otherProps.exact}>
      {
        routeInfo => (
          <BackgroundRouter routeInfo={routeInfo} defaultBackgroundRoute={defaultBackgroundRoute} disabled={disabled}>
            {children}
          </BackgroundRouter>
        )
      }
    </Route>
    {
      !disabled && (
        <Route {...otherProps} />
      )
    }
  </React.Fragment>
)

class BackgroundRouter extends React.Component {

  state = {}

  static getDerivedStateFromProps(nextProps, prevState) {
    // if no match, just forward true routeInfo
    if (!nextProps.routeInfo.match)
      return { routeInfo: nextProps.routeInfo }
    
    // MATCH

    // if the page loaded directly on the modal url
    if (!prevState.routeInfo) {
      let backgroundRoute = "/"
      if (nextProps.defaultBackgroundRoute) {
        backgroundRoute = (typeof nextProps.defaultBackgroundRoute === 'function') ? nextProps.defaultBackgroundRoute(nextProps.routeInfo) : nextProps.defaultBackgroundRoute
      }
      return {
        routeInfo: {
          ...nextProps.routeInfo,
          location: pathStrToLocation(backgroundRoute)
        }
      }
    }
    return null
  }

  render() {
    if (this.props.disabled)
      return this.props.children
    return (
      <RouterContext.Provider value={this.state.routeInfo}>
        {this.props.children}
      </RouterContext.Provider>
    )
  }
}

const pathStrToLocation = pathStr => {
  const parser = document.createElement('a')
  parser.href = pathStr
  return {
    pathname: parser.pathname,
    search: parser.search,
    hash: parser.hash,
    state: undefined
  }
}

export default ModalRouter
