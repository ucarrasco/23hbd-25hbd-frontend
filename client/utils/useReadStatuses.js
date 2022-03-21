import { useMemo, useCallback } from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import useMe from 'utils/useMe'
import fromPairs from 'lodash/fromPairs'

const READ_STATUSES_QUERY = gql`
  query ReadStatuses {
    me {
      id
      readStatuses {
        id
        participation {
          id
        }
        lastPageNumberRead
      }
    }
  }
`

function useReadStatuses() {
  const me = useMe()
  const { data, loading, error } = useQuery(
    READ_STATUSES_QUERY,
    {
      skip: !me,
    }
  )

  const [mutateSetReadStatus] = useMutation(
    gql`
      mutation SetReadStatus(
        $participationId: ID!
        $lastPageNumberRead: Int!
      ) {
        setReadStatus(
          participationId: $participationId
          lastPageNumberRead: $lastPageNumberRead
        ) {
          id
          participation {
            id
          }
          lastPageNumberRead
        }
      }
    `,
    {
      update: (cache, { data }) => {
        const { me } = cache.readQuery({
          query: READ_STATUSES_QUERY
        })
        if (!me.readStatuses.some(readStatus => readStatus.id === data.setReadStatus.id)) {
          cache.writeQuery({
            query: READ_STATUSES_QUERY,
            data: {
              me: {
                ...me,
                readStatuses: [
                  ...me.readStatuses,
                  data.setReadStatus,
                ]
              }
            }
          })
        }
      }
    }
  )

  const active = !!(data && data.me && data.me.readStatuses)

  const readStatusByParticipationId = useMemo(
    () => {
      if (active) {
        return data.me.readStatuses.map(readStatus => [readStatus.participation.id, readStatus]) |> fromPairs
      }
      return null
    },
    [data]
  )

  const setReadStatus = useCallback(
    (participationId, lastPageNumberRead) => {
      mutateSetReadStatus({
        variables: {
          participationId,
          lastPageNumberRead,
        }
      })
    },
    [mutateSetReadStatus]
  )

  const getReadCompletion = useCallback(
    (participationId, donePages) => {
      if (!donePages) return 'empty'
      const readStatus = readStatusByParticipationId[participationId]
      if (!readStatus) return 'unread'
      if (readStatus.lastPageNumberRead >= donePages) return 'read'
      return 'partially-read'
    },
    [readStatusByParticipationId]
  )

  const readPage = useCallback(
    (participationId, pageNumber) => {
      const readStatus = readStatusByParticipationId[participationId]
      const lastPageNumberRead = readStatus ? readStatus.lastPageNumberRead : 0
      if (pageNumber > lastPageNumberRead) {
        // no await since this is background stuff
        setReadStatus(
          participationId,
          pageNumber
        )
      }
    },
    [readStatusByParticipationId, setReadStatus]
  )

  const noop = () => {}

  if (!active) return {
    // setReadStatus: noop,
    getReadCompletion: noop,
    readPage: noop,
  }

  return {
    // setReadStatus,
    getReadCompletion,
    readPage,
  }
}

export default useReadStatuses
