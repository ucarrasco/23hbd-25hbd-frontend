import React from 'react'
import { Row, Col, Button } from 'reactstrap'
import Well from 'components/Well'
import { toast } from 'react-toastify'
import withMutation from 'utils/withMutation'
import gql from 'graphql-tag'
import { EditionParticipations as EDITION_PARTICIPATIONS_QUERY } from '../../Participations/operations.gql'
import EDITION_PARTICIPATIONS_COUNT_QUERY from 'gql/EditionParticipationsCount.gql'
import { useApolloClient } from '@apollo/react-hooks'

const ParticipationForm = ({ subscribe, editionId }) => {
  const apolloClient = useApolloClient()
  const { edition: { year: editionYear } } = apolloClient.readQuery({
    query: gql`
      query EditionYear($editionId: ID!) {
        edition(id: $editionId) {
          id
          year
        }
      }
    `,
    variables: { editionId }
  })
  return (
    <Well title={t(`account-page.profile-page.subscribe-to-edition.title`, { year: editionYear })}>
      <Row>
        <Col xs={{ size: 8, offset: 2 }}>
          <Button
            block
            size="lg"
            color="hbd"
            className="px-4 my-3"
            type="submit"
            style={{ whiteSpace: "normal" }}
            onClick={e => { e.preventDefault(); subscribe().then(() => {
              toast.success(t(`account-page.profile-page.subscribe-to-edition.done`))
            })}}>
              {t(`account-page.profile-page.subscribe-to-edition.submit`, { year: editionYear })}
          </Button>
        </Col>
      </Row>
    </Well>
  )
}

const withSubscribeToEdition = withMutation(
  gql`
    mutation SubscribeToEdition($editionId: ID!) {
      subscribeToEdition(edition: { id: $editionId }) {
        id
      }
    }
  `,
  (mutate, { userId, editionId }) => ({
    subscribe: () =>
      mutate({
        variables: { editionId },
        refetchQueries: [
          {
            query: EDITION_PARTICIPATIONS_QUERY,
            variables: { editionId }
          },
          {
            query: EDITION_PARTICIPATIONS_COUNT_QUERY,
            variables: { editionId }
          }
        ],
        update: (cache, { data }) => {
          cache.writeQuery({
            query: gql`
              query userParticipationToEdition($userId: ID!, $editionId: ID!) {
                user(id: $userId) {
                  id
                  participation(editionId: $editionId) {
                    id
                  }
                }
                edition(editionId: $editionId) {
                  id
                  participation(userId: $userId) {
                    id
                  }
                }
              }
            `,
            variables: {
              userId,
              editionId
            },
            data: {
              user: {
                __typename: "User",
                id: userId,
                participation: {
                  __typename: "Participation",
                  id: data.subscribeToEdition.id
                }
              },
              edition: {
                __typename: "Edition",
                id: editionId,
                participation: {
                  __typename: "Participation",
                  id: data.subscribeToEdition.id
                }
              }
            }
          })
        }
      })
  })
)

export default withSubscribeToEdition(ParticipationForm)

