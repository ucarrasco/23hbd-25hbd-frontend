import React from 'react'
import { withRouter } from 'react-router'
import { Button, Form, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { reduxForm, Field, reset } from 'redux-form'
import { toast } from 'react-toastify'
import history from 'config/history'
import withMutation from 'utils/withMutation'
import gql from 'graphql-tag'
import compose from 'utils/compose'

const closeDialog = _ => { history.replace(`${history.location.pathname}${history.location.search}`) }

let UpdateUsernameDialog = ({ handleSubmit, location }) => (
  <Modal isOpen={location.hash == '#change-username'} toggle={closeDialog}>
    <ModalHeader toggle={closeDialog}>
      {t(`account-page.profile-page.username.modal.title`)}
    </ModalHeader>
    <Form onSubmit={handleSubmit}>
      <ModalBody>
        <Field
          component="input"
          className="form-control"
          type="text"
          name="username"
          autoComplete="off"
          style={{width: "initial", display: "inline"}} />

        <div className="text-warning mt-3">
          {t(`account-page.profile-page.username.modal.instructions`)}
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="default" onClick={closeDialog}>
          {t(`account-page.profile-page.username.modal.cancel`)}
        </Button>
        <Button color="primary" type="submit">
          {t(`account-page.profile-page.username.modal.submit`)}
        </Button>
      </ModalFooter>
    </Form>
  </Modal>
)

const withForm = reduxForm({
  form: 'updateUsername',
  onSubmit: ({ username }, dispatch, { updateUsername }) => {
    updateUsername(username)
      .then(_ => {
        dispatch(reset('updateUsername'))
        toast.success(t(`account-page.profile-page.username.modal.done`))
        closeDialog()
      })
  }
})

const withUpdatePassword = withMutation(
  gql`
    mutation UpdateUsername($userId: ID!, $username: String!) {
      updateUser(
        userId: $userId
        username: $username
      ) {
        id
        username
        usernameLowerCase
      }
    }
  `,
  (mutate, { userId }) => ({
    updateUsername: username => mutate({ variables: { userId, username }})
  })
)


const enhance = compose(
  withRouter,
  withUpdatePassword,
  withForm
)

export default enhance(UpdateUsernameDialog)