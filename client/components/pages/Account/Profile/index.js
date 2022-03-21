import React, { useContext } from 'react'
import { withRouter } from 'react-router'
import { Row, Col, Button } from 'reactstrap'
import userPlaceHolderImage from 'assets/images/user-placeholder.hbd.jpg'
import { toast } from 'react-toastify'

import Well, { WellFooter } from 'components/Well'
import ProfileForm from './ProfileForm'
import UpdateUsernameDialog from './UpdateUsernameDialog'
import UpdatePasswordDialog from './UpdatePasswordDialog'
import AddLinkDialog from './AddLinkDialog'
import UpdateAvatarModal from './UpdateAvatarModal'
import compose from 'utils/compose'
import gql from 'graphql-tag'
import { USER_PROFILE } from 'gql/queries'
import withQueryResult from 'utils/withQueryResult'
import withMutation from 'utils/withMutation'
import history from 'config/history'
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc'
import SubscribeToEditionForm from './SubscribeToEditionForm'
import EditParticipationForm from './EditParticipationForm'
import RelevantEditionContext from '../RelevantEditionContext'


const Profile = ({
  deleteLink,
  user,
  location,
  userId,
  moveLink
}) => {
  const { relevantEdition } = useContext(RelevantEditionContext)
  let openDialog = routeHash => {
    history.replace(`${location.pathname}${location.search}${routeHash}`)
  }

  return (
    <Row className="mt-4">
      <UpdateUsernameDialog userId={userId} />
      <UpdatePasswordDialog userId={userId} />
      <UpdateAvatarModal userId={userId} />
      <AddLinkDialog userId={userId} />

      <Col xs={12} md={4} lg={3} className="col-xl-account-left">

        <Row>
          <Col xs={6} md={12}>
            <Well title={t(`account-page.profile-page.avatar.title`)}>
              <div className="text-center">
                <img
                  className="profile-picture w-100"
                  src={user.avatarUrl || userPlaceHolderImage}
                  alt={t(`account-page.profile-page.avatar.img-alt`, { username: user.username })}
                />
              </div>
              <WellFooter>
                <Button
                  color="hbd"
                  size="sm"
                  className="px-4"
                  onClick={_ => { openDialog('#change-avatar') }}>
                  {t(`account-page.profile-page.avatar.edit`)}
                </Button>
              </WellFooter>
            </Well>
          </Col>

          <Col xs={6} md={{size: 12, offset: 0}} className="d-flex flex-column">
            <Well title={t(`account-page.profile-page.username.title`)}>
              <div className="text-center">
                { user.username }
              </div>
              <WellFooter>
                <Button
                  color="hbd"
                  size="sm"
                  className="px-4"
                  onClick={_ => { openDialog('#change-username') }}>
                  {t(`account-page.profile-page.username.edit`)}
                </Button>
              </WellFooter>
            </Well>

            <div>
              {/* className="d-flex align-items-center justify-content-center" style={{flex: 1}} */}
              <Button
                color="hbd"
                size="sm"
                className="px-3"
                style={{ whiteSpace: 'normal' }}
                onClick={_ => { openDialog('#change-password') }}>
                  {t(`account-page.profile-page.password.title`)}
              </Button>
            </div>
          </Col>
        </Row>

      </Col>

      <Col xs={12} md={8} lg={9} className="col-xl-account-center">

        <ProfileForm user={user} />

        {
          relevantEdition && (
            relevantEdition.myParticipation
              ? <EditParticipationForm participationId={relevantEdition.myParticipation.id} />
              : <SubscribeToEditionForm userId={user.id} editionId={relevantEdition.id} />
          )
        }
      </Col>

      <Col xs={12} lg={{size: 9, offset: 3 }} className="col-xl-account-right">
        <Well title={t(`account-page.profile-page.links.title`)}>
          <div className="text-center">
            {
              user.links.length ?
              <LinksList
                axis="y"
                distance={3}
                onSortEnd={({oldIndex, newIndex}) => { moveLink(oldIndex, newIndex) }}
                // useDragHandle
              >
                {
                  user.links.map(
                    (link, i) =>
                      <Link
                        link={link}
                        deleteLink={deleteLink}
                        key={link.id}
                        index={i}
                      />
                  )
                }
              </LinksList>
              : t(`account-page.profile-page.links.empty`)
            }
          </div>
          <WellFooter>
            <Button color="hbd" size="sm" className="px-3" style={{ whiteSpace: 'normal' }} onClick={_ => { openDialog('#add-link') }}>
              {t(`account-page.profile-page.links.add-link`)}
            </Button>
          </WellFooter>
        </Well>
      </Col>
    </Row>
  )
}

const LinksList = SortableContainer(
  ({ children }) => (
    <ul className="list-unstyled text-left">
      {children}
    </ul>
  )
)

const Link = SortableElement(
  ({ link: { id, title, url }, deleteLink }) => (
    <li className="account-user-link">
      <div className="link-title">
        {/* <DragHandle /> */}
        <a href={url} target="blank" className="link-unstyled">{title}</a>
      </div>
      <a className="link-delete" href="#" onClick={e => { e.preventDefault(); deleteLink(id) }}>X</a>
    </li>
  )
)

const DragHandle = SortableHandle(() => <span>::</span>)

const withMoveLink = withMutation(
  gql`
    mutation UpdateUserLinksOrder($userId: ID!, $oldLinkIndex: Int!, $newLinkIndex: Int!) {
      updateUserLinksOrder(
        userId: $userId
        oldLinkIndex: $oldLinkIndex
        newLinkIndex: $newLinkIndex
      ) {
        id
        links {
          id
          title
          url
        }
      }
    }
  `,
  (mutate, { userId, user }) => ({
    moveLink: (oldLinkIndex, newLinkIndex) => mutate({
      variables: {
        userId,
        oldLinkIndex,
        newLinkIndex
      },
      optimisticResponse: {
        __typename: "Mutation",
        updateUserLinksOrder: {
          id: userId,
          __typename: "User",
          links: (function(links) {
            let updatedLinks = [...links]
            updatedLinks.splice(newLinkIndex, 0, updatedLinks.splice(oldLinkIndex, 1)[0])
            return updatedLinks
          })(user.links)
        }
      }
    }).then(_ => { toast.success(t(`account-page.profile-page.links.reorder-done`)) })
  })
)

const withDeleteLink = withMutation(
  gql`
    mutation DeleteUserLink($userId: ID!, $linkId: ID!) {
      deleteUserLink(
        userId: $userId
        linkId: $linkId
      ) {
        id
        links {
          id
          title
          url
        }
      }
    }
  `,
  (mutate, { userId }) => ({
    deleteLink: linkId => (
      mutate({ variables: { userId, linkId }})
        .then(_ => { toast.success(t(`account-page.profile-page.links.delete-done`)) })
    )
  })
)

const withUserProfile = withQueryResult(
  USER_PROFILE,
  {
    variables: ({ userId }) => ({
      userId
    })
  }
)


export default compose(
  withRouter,
  withUserProfile,
  withDeleteLink,
  withMoveLink
)(Profile)