import React from 'react'
import { Route } from 'react-router'
import EditionParticipations from './EditionParticipations'
import withQueryResult from 'utils/withQueryResult'
import { EditionIds as EDITION_IDS_QUERY } from './operations.gql'
import { ProviderWithState as FocusUserProvider } from './FocusUserContext'
import './participations.scss'
import Layout from './Layout'

const ParticipationsPage = ({ editions }) => {
  return (
    <FocusUserProvider>
      <Layout editions={editions}>
        <Route
          path="/participants/:year/"
          render={
            ({ match }) => (
              <EditionParticipations
                key={match.params.year}
                editionYear={match.params.year}
              />
            )
          }
        />
      </Layout>
    </FocusUserProvider>
  )
}


const withEditions = withQueryResult(EDITION_IDS_QUERY)

export default withEditions(ParticipationsPage)
