import { useEffect } from 'react'
import gql from 'graphql-tag'
import * as Sentry from '@sentry/browser'
import { useQuery } from '@apollo/react-hooks'

const SentryUserUpdater = () => {
  const { data } = useQuery(
    gql`
      query InitialData {
        me {
          id
          username
        }
      }
    `,
    {
      fetchPolicy: 'cache-only'
    }
  )

  useEffect(
    () => {
      setSentryUser(data.me)
    },
    [data.me ? data.me.id : null]
  )

  return null
}

const setSentryUser = me => {
  Sentry.configureScope(
    scope => {
      scope.user = (
        me
          ? {
            id: me.id,
            username: me.username
          }
          : {}
      )
    }
  )
}

export default SentryUserUpdater
