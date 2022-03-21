import React, { useEffect, useState } from 'react'
import { Container } from 'reactstrap'
import HomePage from './pages/Home'
import ParticipationsPage from './pages/Participations'
import BlogPage from './pages/Blog'
import { Route, Switch, Redirect } from 'react-router'
import SignInPage from './pages/SignIn'
import RegisterPage from './pages/Register'
import AccountPage from './pages/Account'
import { Routed as ParticipationPage } from './pages/Participation'
import { Routed as UserPage } from './pages/User'
import websitePageCodes from '../../common/websitePages'
import reject from 'lodash/fp/reject'
import { StandAlone as BlogPostPage } from './pages/Blog/BlogPost'
import { Routed as RedirectToRandomParticipationPage } from './RedirectToRandomParticipation'
import gql from 'graphql-tag'
import ContactPage from './pages/Contact.hbd'
import NotFoundPage from './pages/NotFound.hbd'
import MediaQuery from 'react-responsive'
import { gridBreakpoints } from 'config/sassVariables'
import ModalRouter from 'utils/ModalRouter'
import { Routed as UnsubscribeResult } from './pages/UnsubscribeResult'
import { useQuery, useMutation } from '@apollo/react-hooks'
import SentryUserUpdater from './SentryUserUpdater'
import TeaserContainer from './TeaserContainer'
import Layout from './Layout'
import RulesPage from './pages/Rules'
import FanartsPage from './pages/Fanarts'
import ResponsiveDebugger from 'utils/ResponsiveDebugger'
import useMobileReaderMode from 'utils/useMobileReaderMode'
import i18next from 'i18next'
import INITIAL_DATA_QUERY from './initialData.gql'
import BecomePanel from './BecomePanel'

const cmsPageCodes = websitePageCodes |> reject(code => code === "home" || code === "rules")


const App = () => {

  const { data, loading, error } = useQuery(INITIAL_DATA_QUERY)

  const { data: data2, loading: loading2, error: error2 } = useQuery(
    gql`
      query FanartsPageId($editionId: ID!) {
        fanartsPage(editionId: $editionId) {
          id
        }
      }
    `,
    {
      variables: { editionId: data && data.currentEdition && data.currentEdition.id },
      skip: !(data && data.currentEdition),
    }
  )

  const [updateLanguage] = useMutation(gql`
    mutation UpdateLanguage($userId: ID!, $language: String!) {
      updateUser(
        userId: $userId
        preferences: {
          language: $language
        }
      ) {
        id
        preferences {
          language
        }
      }
    }
  `)

  useEffect(() => {
    if (data && data.me && !data.me.preferences.language) {
      updateLanguage({
        variables: {
          userId: data.me.id,
          language: i18next.language,
        }
      })
    }
  }, [(data && data.me && data.me.id)])

  const mobileReaderMode = useMobileReaderMode()

  if (loading || error || loading2 || error2) return <div style={{ height: "100vh", width: "100%", backgroundColor: "white" }} />;

  const teasedEdition = (
    (data.incomingEdition && data.incomingEdition.status.teaserEnabled)
      ? data.incomingEdition
      : undefined
  )

  const { currentEdition } = data

  return (
    <TeaserContainer teasedEdition={teasedEdition}>
      {/* <ResponsiveDebugger /> */}
      <BecomePanel />
      <Layout>
        <ModalRouter
          path="/participants/:year([0-9]{4})/:participationIdentifier/"
          component={ParticipationPage}
          defaultBackgroundRoute={({ match: { params: { year } } }) => `/participants/${year}/`}
          disabled={!mobileReaderMode}
        >
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route path="/rules/" component={RulesPage} />
            <Route path="/participants/" exact render={() => <Redirect to={currentEdition ? `/participants/${currentEdition.year}/` : "/"} />} />
            <Route path="/participants/:year([0-9]{4})?/" exact component={ParticipationsPage} />
            <Route exact path="/participants/:year([0-9]{4})/:participationIdentifier/" component={ParticipationPage} />
            <Route exact path="/blog/" component={BlogPage} />
            <Route exact path="/u/:userId/" component={UserPage} />
            <Route path="/blog/:slug/" render={({ match }) => <BlogPostPage slug={match.params.slug} />} />
            <Route path="/connexion/" component={SignInPage} />
            <Route path="/register/" component={RegisterPage} />
            <Route path="/compte/" component={AccountPage} />
            <Route path="/random-participation/" component={RedirectToRandomParticipationPage} />
            <Route path="/contact/" component={ContactPage} />
            <Route path="/unsubscribe-success/" component={UnsubscribeResult} />
            <Route path="/unsubscribe-error/" component={UnsubscribeResult} />
            {
              !!(data2 && data2.fanartsPage) && (
                <Route path="/fanarts/" component={FanartsPage} />
              )
            }
            <Route path="*" component={NotFoundPage} />
          </Switch>
        </ModalRouter>
      </Layout>
      <SentryUserUpdater />
    </TeaserContainer>
  )
}

export default App
