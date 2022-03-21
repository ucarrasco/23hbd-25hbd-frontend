import React, { createContext } from 'react'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'
import useMe from 'utils/useMe'

const RelevantEditionContext = createContext()

export const Provider = ({ children }) => {
  const { id: userId } = useMe()
  const { data, loading, error } = useQuery(
    gql`
      query RelevantEditions($userId: ID!) {
        incomingEdition {
          id
          status {
            usersCanRegister
          }
          myParticipation: participation(userId: $userId) {
            id
          }
        }
        currentEdition {
          id
          myParticipation: participation(userId: $userId) {
            id
          }
        }
      }
    `,
    { variables: { userId } }
  )

  if (loading || error) return null
  const { incomingEdition, currentEdition } = data

  let relevantEdition = null
  let type = null

  // business logic here:

  if (incomingEdition && incomingEdition.status.usersCanRegister) {
    relevantEdition = incomingEdition
    type = 'incomingEdition'
  }
  else if (currentEdition) {
    relevantEdition = currentEdition
    type = 'currentEdition'
  }

  return (
    <RelevantEditionContext.Provider value={{
      relevantEdition,
      type
    }}>
      {children}
    </RelevantEditionContext.Provider>
  )
}

export const Consumer = RelevantEditionContext.Consumer

export default RelevantEditionContext
