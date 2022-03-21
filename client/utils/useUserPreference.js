import { useMemo, useCallback } from 'react'
import gql from 'graphql-tag'
import { useQuery, useMutation } from '@apollo/react-hooks'

function useUserPreference(preferenceKey) {
  const { data: { me } } = useQuery(
    gql`
      query UserPreference {
        me {
          id
          preferences {
            ${preferenceKey}
          }
        }
      }
    `,
    { fetchPolicy: 'cache-only' }
  )

  const [mutateValue] = useMutation(
    gql`
      mutation UpdateUserPreference(
        $userId: ID!
        $input: UserPreferencesInput!
      ) {
        updateUser(
          userId: $userId
          preferences: $input
        ) {
          id
          preferences {
            ${preferenceKey}
          }
        }
      }
    `,
  )
  const onChange = useCallback(
    newValue => {
      mutateValue(
        {
          variables: {
            userId: me && me.id,
            input: {
              [preferenceKey]: newValue,
            },
          },
          optimisticResponse: {
            __typename: "Mutation",
            updateUser: {
              __typename: "User",
              id: me.id,
              preferences: {
                __typename: "UserPreferences",
                [preferenceKey]: newValue,
              }
            }
          },
        }
      )
    },
    [mutateValue]
  )

  const noop = useMemo(
    () => [undefined, () => {}],
    []
  )

  if (!me) return noop
  return [
    me.preferences[preferenceKey],
    onChange,
  ]
}

export default useUserPreference
