import React from 'react'
import { Query } from '@apollo/react-components'
import gql from 'graphql-tag'
import withQueryResult from 'utils/withQueryResult'
import { ME } from 'gql/queries'

export const withCurrentEditionId = withQueryResult(
  gql`
    query CurrentEditionId {
      currentEdition {
        id
      }
    }
  `,
  {
    props: ({ currentEdition }) => ({ editionId: currentEdition && currentEdition.id })
  }
)

export const withLoggedUserId = ChildComponent => (
  props => (
    <Query query={ME}>
      {
        ({ data, error, loading }) => {
          if (error || loading) return null
          return (
            <ChildComponent
              {...props}
              userId={(data && data.me) ? data.me.id : undefined}
            />
          )
        }
      }
    </Query>
  )
)
