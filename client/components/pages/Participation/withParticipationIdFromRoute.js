import React from 'react'
import gql from 'graphql-tag'
import withQueryResult from 'utils/withQueryResult'
import isObjectIdString from 'common/isObjectIdString'

const withParticipationIdFromRoute = ChildComponent => {
  const withParticipationIdByUserSlug = withQueryResult(
    gql`
      query EditionParticipation(
        $editionYear: Int!
        $userSlug: String!
      ) {
        participation(
          editionYearAndUserSlug: {
            editionYear: $editionYear
            userSlug: $userSlug
          }
        ) {
          id
        }
      }
    `,
    {
      variables: ({ year, userSlug }) => ({
        editionYear: year,
        userSlug
      }),
      props: ({ participation }) => ({ participationId: participation.id })
    }
  )
  const ByUserSlug = withParticipationIdByUserSlug(ChildComponent)
  return ({
    match: {
      params: { year, participationIdentifier }
    }
  }) => (
    isObjectIdString(participationIdentifier)
      ? <ChildComponent participationId={participationIdentifier} />
      : <ByUserSlug year={year} userSlug={participationIdentifier} />
  )
}

export default withParticipationIdFromRoute
