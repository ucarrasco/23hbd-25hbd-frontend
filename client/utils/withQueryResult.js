import React from 'react'
import memoize from 'lodash/memoize'
import tap from 'lodash/fp/tap'
import { Query } from '@apollo/react-components'

const logWriteError = memoize(
  error => { console.error(error) }
)

export default (query, options = {}) => ChildComponent => {
  options = {
    props: same => same,
    variables: props => undefined, // eslint-disable-line no-unused-vars
    renderOnlyIfData: true,
    if: props => true,
    elseProps: props => ({}),
    apollo: {},
    ...options
  }
  return (
    props => (
      options.if(props)
        ? (
          <Query query={query} variables={options.variables(props)} {...(typeof options.apollo === "function" ? options.apollo(props) : options.apollo )}>{
            ({ data, loading, error }) => {
              loading = !!props.loading || loading
              if (error && error.networkError && error.networkError.type === 'WriteError')
                logWriteError(error)
              error = props.error || error
              if (options.renderOnlyIfData)
                return (loading || error)
                    ? null
                    : <ChildComponent {...props} {...(options.props(data, props))} />

              return (
                <ChildComponent
                  {...props}
                  {...{
                    loading,
                    error,
                    ...(
                      (loading)
                        ? {}
                        : options.props(data, props)
                    )
                  }}
                />
              )
            }
          }</Query>
        )
        : <ChildComponent {...props} {...options.elseProps(props)} />
    )
  ) |> tap(
    newComponent => { newComponent.displayName = `WithQueryResult(${ChildComponent.displayName || ChildComponent.name || "Unknown"})` }
  )
}