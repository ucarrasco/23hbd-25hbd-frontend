import React from 'react'
import withQueryResult from 'utils/withQueryResult'
import UserInfo from './UserInfo'
import { withRouter } from 'react-router'
import compose from 'utils/compose'
import { EditionThemeAndParticipationsCount as EDITION_THEME_AND_PARTICIPATIONS_COUNT_QUERY } from '../operations.gql'
import nl2br from 'utils/nl2br'

const InfoBar = ({ theme, participationsCount, loading }) => (
  <div className="hbd-autbar__content">

    <UserInfo />

    <div className="hbd-autbar__nbpart  text-center  border-right-lg-0">
      <p className="mb-0  p-3">
        {t(`participations-page.info-bar.participants-count`)}
      </p>
      <p><strong>{ loading ? null : participationsCount }</strong></p>
    </div>
    <div className="hbd-autbar__theme  text-center  p-2">
      {
        (!loading && theme)
          ? nl2br(theme)
          : undefined
      }
    </div>
  </div>
)


const withEditionThemeAndParticipationsCount = withQueryResult(
  EDITION_THEME_AND_PARTICIPATIONS_COUNT_QUERY,
  {
    variables: ({ match }) => ({ year: parseInt(match.params.year) }),
    props: ({ edition }) => (
      edition
        ? {
          theme: edition.theme,
          participationsCount: edition.participationsCount
        }
        : {}
      ),
    renderOnlyIfData: false,
    if: ({ match }) => match.params.year
  }
)

let enhance = compose(
  withRouter,
  withEditionThemeAndParticipationsCount
)

export default enhance(InfoBar)
