import React from 'react'
import withQueryResult from 'utils/withQueryResult'
import { Redirect } from 'react-router'
import gql from 'graphql-tag'
import qs from 'query-string'

const RedirectToRandomParticipation = withQueryResult(
  gql`
    query RandomParticipation(
      $fromEdition: InputEditionQuery
      $fullOnly: Boolean
    ) {
      randomParticipation(
        fromEdition: $fromEdition
        fullOnly: $fullOnly
      ) {
        id
        edition {
          id
          year
        }
        user {
          id
          slug
        }
      }
    }
  `,
  {
    variables: ({
      fullOnly,
      editionYear
    }) => ({
      fullOnly,
      fromEdition: editionYear ? { year: editionYear } : undefined
    }),
    props: ({ randomParticipation }) => ({
      participationId: randomParticipation.id,
      editionYear: randomParticipation.edition.year,
      userSlug: randomParticipation.user.slug
    }),
    apollo: {
      fetchPolicy: "network-only"
    }
  }
)(
  ({ participationId, editionYear, userSlug }) => (
    <Redirect to={userSlug ? `/participants/${editionYear}/${userSlug}/` : `/participants/${participationId}/`} />
  )
)

export const Routed = ({ location: { search }, ...props }) => {
  const {
    full_only: fullOnlyStr,
    edition_year: editionYearStr
  } = qs.parse(search)

  return (
    <RedirectToRandomParticipation
      fullOnly={fullOnlyStr ? JSON.parse(fullOnlyStr) : undefined}
      editionYear={editionYearStr ? parseInt(editionYearStr) : undefined}
      {...props}
    />
  )
}

export default RedirectToRandomParticipation
