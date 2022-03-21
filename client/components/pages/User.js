import React from 'react'
import maxBy from 'lodash/fp/maxBy'
import { Redirect } from 'react-router'
import withQueryResult from 'utils/withQueryResult'
import gql from 'graphql-tag'
import qs from 'query-string'


const UserPage = withQueryResult(
  gql`
    query UserParticipations($userId: ID!) {
      user(id: $userId) {
        id
        slug
        participations {
          id
          edition {
            id
            year
          }
        }
      }
    }
  `,
  {
    variables: ({ userId }) => ({ userId }),
    props: ({ user }) => ({ user }),
    renderOnlyIfData: false
  }
)(
  ({ user, loading, error, preferredYear }) => {
    if (loading) return null
    return (
      <Redirect
        to={
          (error || !user.participations.length)
            ? "/"
            : `/participants/${
              (
                (preferredYear && user.participations.find(p => p.edition.year == preferredYear))
                  || (user.participations |> maxBy('edition.year'))
              ).edition.year
            }/${user.slug}/`
        }
      />
    )
  }
)

export const Routed = ({ match: { params: { userId }}, location: { search }, ...props }) => (
  <UserPage
    {...props}
    userId={userId}
    preferredYear={
      search && qs.parse(search).preferred_year
    }
  />
)

export default UserPage
