import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { Redirect } from 'react-router'
import FanartsContent from './FanartsContent'

export default function FanartsPage() {
  const currentEditionId = useQuery(
    gql`
      query CurrentEditionId {
        currentEdition {
          id
        }
      }
    `,
    { fetchPolicy: 'cache-only' },
  ).data.currentEdition.id
  const { data, loading, error } = useQuery(
    gql`
      query FanartsPageId($editionId: ID!) {
        fanartsPage(editionId: $editionId) {
          id
          content
        }
      }
    `,
    {
      variables: { editionId: currentEditionId },
    }
  )

  if (loading || error) return null
  if (!data.fanartsPage) return <Redirect to="/" />

  const { content } = data.fanartsPage

  return (
    <FanartsContent>
      {content}
    </FanartsContent>
  )
}
