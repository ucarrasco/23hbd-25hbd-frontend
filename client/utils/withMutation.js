import { Mutation } from '@apollo/react-components'
import React from 'react'
import { toast } from 'react-toastify'
import { defaultErrorMessage } from 'utils/texts'

export default function withMutation(
  mutation,
  options
) {
  options = (typeof options === "function") ? { mapMutateToProps: options } : options
  options = {
    mapMutateToProps: (mutate, props) => ({}), // eslint-disable-line no-unused-vars
    apollo: {},
    ...options
  }

  return function(ChildComponent) {
    return props =>
      <Mutation mutation={mutation} {...options.apollo}>
        {
          mutate =>
            <ChildComponent
              {...props}
              {...options.mapMutateToProps(mutateWithErrorToastOption(mutate), props)}
            />
        }
      </Mutation>
  }
}

/**
 * Adds a `toastOnError` (boolean|string) option to `mutate`
 */
const mutateWithErrorToastOption = mutate =>
  (...args) => {
    const [{ toastOnError, ...arg0 }, ...argsRest] = args
    let resPromise = mutate(...[arg0, ...argsRest])
    if (toastOnError)
      resPromise = resPromise.then(
        undefined,
        error => {
          const isPublicError = (error && error.graphQLErrors && error.graphQLErrors.length && error.graphQLErrors[0].extensions && error.graphQLErrors[0].extensions.exception && error.graphQLErrors[0].extensions.exception.toast)
          // don't toast public error here since it's automatically done @ apollo client error handler
          if (!isPublicError)
            toast.error(toastOnError === true ? defaultErrorMessage : toastOnError)
          return Promise.reject(error)
        }
      )
    return resPromise
  }