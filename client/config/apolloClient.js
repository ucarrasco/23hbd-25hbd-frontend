import { ApolloClient } from 'apollo-client'
import { setContext } from 'apollo-link-context'
import { InMemoryCache, IntrospectionFragmentMatcher  } from 'apollo-cache-inmemory'
import { onError } from "apollo-link-error"
import { ApolloLink } from 'apollo-link'
import { createUploadLink } from 'apollo-upload-client'
import cacheRedirects from './apolloCacheRedirects'
import { toast } from 'react-toastify'
import history from 'config/history'
import logout from 'utils/logout'
import Cookies from 'js-cookie'

export const makeApolloClient = (target = 'main-app') => {

  // https://www.apollographql.com/docs/react/advanced/fragments.html
  const fragmentMatcher = new IntrospectionFragmentMatcher({
    introspectionQueryResultData: {
      "__schema": {
        "types": [
          {
            "kind": "INTERFACE",
            "name": "Comment",
            "possibleTypes": [
              {
                "name": "UserComment"
              },
              {
                "name": "GuestComment"
              },
              {
                "name": "UserReaction"
              }
            ]
          }
        ]
      }
    }
  })

  const fetchWithOperationName = (uri, options) => {
    if (typeof options.body === 'string')
      uri = `${uri}?opname=${JSON.parse(options.body).operationName}`
    return fetch(uri, options)
  }

  const additionnalOptions = {}
  // if (process.env.NODE_ENV === 'development')
  additionnalOptions.fetch = fetchWithOperationName

  const endpoint = {
    "main-app": `${process.env.HTTP_HOST}/graphql`,
    admin: `${process.env.HTTP_HOST}/graphqlAdmin`
  }[target]

  const httpLink = createUploadLink({
    uri: endpoint,
    ...additionnalOptions
  })

  const authLink = setContext((_, { headers }) => {
    const headersToAdd = {}
    let token = Cookies.get('accessToken')
    if (target === 'admin' && Cookies.get('becomePreviousToken')) {
      token = Cookies.get('becomePreviousToken')
    }
    if (token)
      headersToAdd['Access-Token'] = token
    const language = Cookies.get('i18next')
    if (language)
      headersToAdd['Accept-Language'] = language
    return {
      headers: {
        ...headers,
        ...headersToAdd
      }
    }
  })

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      let unauthenticated = false
      graphQLErrors.forEach(({ message, locations, path, problems, extensions }) => {
        let errorMessage = `[GraphQL error]: Message: ${message}`
        if (problems)
          errorMessage += problems.map(({ explanation, path }) => `\n${path.join('.')}: ${explanation}`)
        const error = new Error(errorMessage)
        if (extensions && extensions.exception && extensions.exception.stacktrace)
          error.stack = [
            `[GraphQL error] BACKEND STACKTRACE:`,
            ...extensions.exception.stacktrace
          ].join("\n")
        console.error(error)
        if (extensions && extensions.code === 'UNAUTHENTICATED')
          unauthenticated = true
        if (extensions && extensions.exception && extensions.exception.toast)
          toast.error(message)
      })
      if (unauthenticated) {
        toast.warn(`La session a expiré`)
        history.push("/")
        logout(client)
      }
    }

    if (networkError && networkError.bodyText)
      console.error(`[Network error]:\n${networkError.bodyText}`)
  })

  const link = ApolloLink.from([
    errorLink,
    authLink,
    httpLink
  ]);

  const cache = new InMemoryCache({
    fragmentMatcher,
    cacheRedirects
  })

  const client = new ApolloClient({
    link,
    cache
  })

  return client
}

export default makeApolloClient('main-app')

