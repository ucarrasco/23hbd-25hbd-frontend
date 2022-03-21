import React from 'react'
import { withRouter } from 'react-router'
import { Button, Label, Form, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { reduxForm, Field, reset } from 'redux-form'
import { toast } from 'react-toastify'
import history from 'config/history'
import withMutation from 'utils/withMutation'
import gql from 'graphql-tag'

const closeDialog = _ => { history.replace(`${history.location.pathname}${history.location.search}`) }

let AddLinkDialog = ({ handleSubmit, location }) => (
  <Modal isOpen={location.hash == '#add-link'} toggle={closeDialog}>
    <ModalHeader toggle={closeDialog}>
      {t(`account-page.profile-page.links.modal.title`)}
    </ModalHeader>
    <Form onSubmit={handleSubmit}>
      <ModalBody>
        <Label for="title">
          {t(`account-page.profile-page.links.modal.link-title.label`)}
        </Label>
        <Field
          component="input"
          className="form-control"
          type="text"
          name="title"
          autoComplete="off" />

        <Label for="url">
          {t(`account-page.profile-page.links.modal.link-url.label`)}
        </Label>
        <Field
          component="input"
          className="form-control"
          type="text"
          name="url"
          autoComplete="off" />

      </ModalBody>
      <ModalFooter>
        <Button color="default" onClick={closeDialog}>
          {t(`account-page.profile-page.links.modal.cancel`)}
        </Button>
        <Button color="primary" type="submit">
          {t(`account-page.profile-page.links.modal.submit`)}
        </Button>
      </ModalFooter>
    </Form>
  </Modal>
)

const withForm = reduxForm({
  form: 'addLink',
  onSubmit: ({ title, url }, dispatch, { addLink }) => {
    addLink(title, url)
      .then(_ => {
        toast.success(t(`account-page.profile-page.links.modal.done`))
        dispatch(reset('addLink'))
        closeDialog()
      })
  }
})

const withAddLink = withMutation(
  gql`
    mutation AddUserLink($userId: ID!, $title: String!, $url: String!) {
      addUserLink(
        userId: $userId
        link: {
          title: $title
          url: $url
        }
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
    addLink: (title, url) => mutate({
      variables: {
        userId,
        title,
        url
      }
    })
  })
)

export default withRouter(withAddLink(withForm(AddLinkDialog)))