import React, { useContext } from 'react'
import Profile from './Profile'
import { ButtonGroup } from 'reactstrap'
import { Link } from 'react-router-dom'
import { Route } from 'react-router'
import Planches from './Planches'
import Comments from './Comments'
import compose from 'utils/compose'
import { ME } from 'gql/queries'
import { Redirect } from 'react-router'
import { Query } from '@apollo/react-components'
import RelevantEditionContext, { Provider as RelevantEditionProvider } from './RelevantEditionContext'
import './account.scss'

function Account({ userId }) {
  const { relevantEdition } = useContext(RelevantEditionContext)
  const participates = relevantEdition && relevantEdition.myParticipation
  return pug`
    #account-page
      if participates
        nav.nav-top.align-items-center.d-flex
          ButtonGroup
            Link.btn.btn-primary.px-4(to="/compte/")= t('account-page.menu.profile')
            Link.btn.btn-primary.px-4(to="/compte/planches/")= t('account-page.menu.planches')
            Link.btn.btn-primary.px-4(to="/compte/commentaires")= t('account-page.menu.comments')
      Route(
        exact
        path="/compte/"
        render=${props => pug`
          Profile(...props userId=userId)
        `}
      )
      if participates
        Route(exact path="/compte/planches/" render=${props => <Planches {...props} userId={userId} />})
        Route(exact path="/compte/commentaires/" render=${props => pug`Comments(...props userId=userId)`})
  `
}

const withRelevantEditionContext = ChildComponent => (props) => (
  <RelevantEditionProvider>
    <ChildComponent {...props} />
  </RelevantEditionProvider>
)

const withUserId = ChildComponent =>
  props =>
    <Query query={ME}>
      {
        ({ data, error, loading }) =>
          (error || loading || !data || !data.me)
            ? <Redirect to="/" />
            : <ChildComponent {...props} userId={data.me.id} />
      }
    </Query>

const enhance = compose(
  withUserId,
  withRelevantEditionContext,
)

export default enhance(Account)
