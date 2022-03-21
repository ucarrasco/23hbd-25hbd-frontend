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


let UpdatePasswordDialog = ({ handleSubmit, location }) => (
  <Modal isOpen={location.hash == '#change-password'} toggle={closeDialog}>
    <ModalHeader toggle={closeDialog}>
      {t(`account-page.profile-page.password.modal.title`)}
    </ModalHeader>
    <Form onSubmit={handleSubmit}>
      <ModalBody>
        <Field
          component="input"
          className="form-control"
          type="password"
          name="password"
          style={{width: "initial", display: "inline"}} />

        <div className="text-warning mt-3">
          {t(`account-page.profile-page.password.modal.instructions`)}
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="default" onClick={closeDialog}>
          {t(`account-page.profile-page.password.modal.cancel`)}
        </Button>
        <Button color="primary" type="submit">
          {t(`account-page.profile-page.password.modal.submit`)}
        </Button>
      </ModalFooter>
    </Form>
  </Modal>
)

const withForm = reduxForm({
  form: 'updatePassword',
  onSubmit: ({ password }, dispatch, { updatePassword }) => {
    updatePassword(password)
      .then(_ => {
        dispatch(reset('updatePassword'))
        closeDialog()
        toast.success(t(`account-page.profile-page.password.modal.done`))
      })
  }
})


const withUpdatePassword = withMutation(
  gql`
    mutation UpdatePassword($userId: ID!, $password: String!) {
      updateUser(
        userId: $userId
        password: $password
      ) {
        id
      }
    }
  `,
  (mutate, { userId }) => ({
    updatePassword: password => mutate({ variables: { userId, password }})
  })
)

const enhance = compose(
  withRouter,
  withUpdatePassword,
  withForm
)

export default enhance(UpdatePasswordDialog)