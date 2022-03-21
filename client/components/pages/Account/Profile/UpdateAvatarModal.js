import React from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { Button, Form, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { reduxForm, Field, reset, change, formValueSelector } from 'redux-form'
import { toast } from 'react-toastify'
import history from 'config/history'
import withMutation from 'utils/withMutation'
import gql from 'graphql-tag'
import compose from 'utils/compose'
import withQueryResult from 'utils/withQueryResult'
import ReduxFormedFileInput from 'components/common/ReduxFormedFileInput'
import moment from 'moment'
import { INSTRUCTIONS_KEY } from 'common/avatarUploadPolicy'

const closeDialog = _ => { history.replace(`${history.location.pathname}${history.location.search}`) }

const UpdateAvatarModal = withRouter(
  ({
    location,
    ...otherProps
  }) => (
    <Modal isOpen={location.hash == '#change-avatar'} toggle={closeDialog}>
      <ModalHeader toggle={closeDialog}>
        {t(`account-page.profile-page.avatar.modal.title`)}
      </ModalHeader>
      <UpdateAvatarForm onCancel={closeDialog} {...otherProps} />
    </Modal>
  )
)

const BaseUpdateAvatarForm = ({
  handleSubmit,
  onUploadFinish,
  invalid,
  avatarUrl,
  deleteAvatar,
  onCancel,
  dirty
}) => (
  <Form onSubmit={handleSubmit}>
    <ModalBody>

      <Field
        component={ReduxFormedFileInput}
        name="avatar"
        accept="image/*"
        getImageDimensions
        showErrors
      />

      <div className="text-warning mt-3">
        {t(INSTRUCTIONS_KEY)}
      </div>
    </ModalBody>
    <ModalFooter>
      { avatarUrl && [
        <Button key="del" color="danger" onClick={deleteAvatar}>
          {t(`account-page.profile-page.avatar.modal.delete`)}
        </Button>,
        <div key="spacer" style={{flex: 1}}></div>
      ]}
        <Button color="default" onClick={onCancel}>
          {t(`account-page.profile-page.avatar.modal.cancel`)}
        </Button>
      <Button color="primary" type="submit" disabled={!dirty || invalid}>
        {t(`account-page.profile-page.avatar.modal.submit`)}
      </Button>
    </ModalFooter>
  </Form>
)



const withForm = reduxForm({
  form: 'updateAvatar',
  onSubmit: ({ avatar: { file } }, dispatch, { updateAvatar }) => {
    updateAvatar(file)
      .then(_ => {
        toast.success(t(`account-page.profile-page.avatar.modal.done`))
        closeDialog()
      })
  },
  validate: ({ avatar }) => {
    console.log("validate")
    if (!avatar)
      return { avatar: " " } // poor version for "avatar is mandatory"
    if (!avatar.file || !avatar.imageDimensions)
      return { avatar: t(`account-page.profile-page.avatar.modal.validation-20200322.invalid-image`) }
    if (avatar.fileType !== 'image/jpeg')
      return { avatar: t(`account-page.profile-page.avatar.modal.validation-20200322.invalid-file-type`) }
    if (avatar.imageDimensions.width > 135 || avatar.imageDimensions.height > 135)
      return { avatar: t(`account-page.profile-page.avatar.modal.validation-20200322.invalid-image-dimensions`) }
    if (avatar.file.size > 200 * 1024)
      return { avatar: t(`account-page.profile-page.avatar.modal.validation-20200322.invalid-file-size`) }
    return {}
  }
})

const withUpdateAndDeleteAvatar = withMutation(
  gql`
    mutation UpdateAvatarUrl($userId: ID!, $avatar: Upload) {
      updateUser(
        userId: $userId
        avatar: $avatar
      ) {
        id
        avatarUrl
      }
    }
  `,
  (mutate, { userId }) => ({
    updateAvatar: avatar => mutate({ variables: { userId, avatar } }),
    deleteAvatar: () => (
      mutate({ variables: { userId, avatar: null }})
        .then(_ => {
          toast.success(t(`account-page.profile-page.avatar.modal.delete-done`))
          closeDialog()
        })
      )
  })
)

const withAvatarUrl = withQueryResult(
  gql`
    query AvatarUrl($userId: ID!) {
      user(id: $userId) {
        id
        avatarUrl
      }
    }
  `,
  {
    variables: ({ userId }) => ({ userId }),
    props: ({ user: { avatarUrl } }) => ({ avatarUrl })
  }
)

const withState = connect(
  dispatch => ({
    onUploadFinish: ({ url }) => {
      dispatch(change("updateAvatar", "avatarUrl", url))
    }
  })
)

const enhance = compose(
  withAvatarUrl,
  withUpdateAndDeleteAvatar,
  withState,
  withForm
)

const UpdateAvatarForm = enhance(BaseUpdateAvatarForm)

export default UpdateAvatarModal
