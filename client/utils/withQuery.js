import { ApolloConsumer } from '@apollo/react-hooks'
import React from 'react'

export default function withQuery(
  query,
  options
) {
  options = (typeof options === "function") ? { mapQueryToProps: options } : options
  options = {
    mapQueryToProps: (fireQuery, props) => ({}), // eslint-disable-line no-unused-vars
    apollo: {},
    ...options
  }

  return function(ChildComponent) {
    return props =>
      <ApolloConsumer>
        {
          client => {
            const fireQuery = (queryOptions = {}) =>
              client.query({
                query,
                ...queryOptions
              }).then(({ data }) => data)
            return (
              <ChildComponent
                {...props}
                {...options.mapQueryToProps(fireQuery, props)}
              />
            )
          }
        }
      </ApolloConsumer>
  }
}