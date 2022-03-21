import React, { useContext } from 'react'
import { connect } from 'react-redux'
import withQueryResult from 'utils/withQueryResult'
import gql from 'graphql-tag'
import userPlaceHolderImage from 'assets/images/user-placeholder.hbd.jpg'
import FocusUserContext from '../FocusUserContext'

const UserInfo = ({ username, avatarUrl, description }) => (
  <React.Fragment>
    <div
      className="hbd-autbar__avatar  rounded  border  mr-2  my-3"
      style={{backgroundImage: `url(${avatarUrl || userPlaceHolderImage})`}}
    />
    <div className="hbd-autbar__descript  mb-0  mr-2  border  p-2  bg-white  my-3">
      <div className="mb-1"><strong>{username}</strong></div>
      {description || t(`participations-page.info-bar.user-info.no-description`)}
    </div>
  </React.Fragment>
)

const withUserInfoFetched = withQueryResult(
  gql`
    query UserPreviewInfo($userId: ID!) {
      user(id: $userId) {
        id
        username
        avatarUrl
        description
      }
    }
  `,
  {
    variables: ({ userId }) => ({ userId }),
    props: ({ user: { username, avatarUrl, description } }) => ({ username, avatarUrl, description }),
    renderOnlyIfData: false
  }
)

const FetchyUserInfo = withUserInfoFetched(UserInfo)

const UserInfoFetchyOrNotFetchy = () => {
  const { focusedUserId } = useContext(FocusUserContext)
  return (
    focusedUserId
      ? <FetchyUserInfo userId={focusedUserId} />
      : <UserInfo />
  )
}

export default UserInfoFetchyOrNotFetchy
