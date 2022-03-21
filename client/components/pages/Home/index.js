import React from 'react'
import Home from './index.hbd'
import { Link } from 'react-router-dom'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

export default () => {
  const {
    loading,
    error,
    preRegisterableEdition,
  } = usePreRegister()
  const { data: { currentEdition }} = useQuery(
    gql`
      query CurrentEdition {
        currentEdition {
          id
          year
          beginDate
          endDate
          customData
          theme
        }
      }
    `, { fetchPolicy: 'cache-only' }
  )
  if (loading || error) return null
  return (
    <div>
      {
        preRegisterableEdition && (
          <div style={{ margin: "-24px -24px 0 -24px", paddingBottom: 24 }}>
            <div className="post-it-info preregister-info">
              L'édition {preRegisterableEdition.year} arrive ! Tu peux déjà t'inscrire <Link to="/register">ici</Link>
            </div>
          </div>
        )
      }
      <Home currentEdition={currentEdition} />
    </div>
  )
}

function usePreRegister() {
  const { data: { incomingEdition } } = useQuery(
    gql`
      query IncomingEdition {
        incomingEdition {
          id
          year
          status {
            usersCanRegister
          }
        }
      }
    `,
    { fetchPolicy: 'cache-only' }
  )
  const skip = !(incomingEdition && incomingEdition.status.usersCanRegister)
  const { data, loading, error } = useQuery(
    gql`
      query MyParticipationToIncomingEdition($editionId: ID!) {
        me {
          id
          participation(editionId: $editionId) {
            id
          }
        }
      }
    `,
    {
      skip,
      variables: { editionId: incomingEdition && incomingEdition.id }
    }
  )

  return {
    loading,
    error,
    preRegisterableEdition: (
      skip
        ? null
        : (
          (loading || error)
            ? null
            : (
              (data.me && data.me.participation)
                ? null
                : incomingEdition
            )
        )
    )
  }
}