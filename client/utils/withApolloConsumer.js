import { ApolloConsumer } from '@apollo/react-hooks'
import React from 'react'

export default function withApolloConsumer(
  options
) {
  options = (typeof options === "function") ? { mapClientToProps: options } : options
  options = {
    mapClientToProps: (mutate, props) => ({}), // eslint-disable-line no-unused-vars
    ...options
  }

  return function(ChildComponent) {
    return props =>
      <ApolloConsumer>
        {
          client =>
            <ChildComponent
              {...props}
              {...options.mapClientToProps(client, props)}
            />
        }
      </ApolloConsumer>
  }
}