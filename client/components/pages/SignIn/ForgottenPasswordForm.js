import React from 'react'
import {
  Form,
  FormGroup,
  Button
} from 'reactstrap'
import { Field, reduxForm, reset } from 'redux-form'
import { toast } from 'react-toastify'
import { Mutation } from '@apollo/react-components'
import compose from 'utils/compose'
import gql from 'graphql-tag'

const ForgottenPasswordForm = ({ handleSubmit }) => (
  <Form className="text-center" onSubmit={handleSubmit}>
    <FormGroup>
      <Field
        component="input"
        className="form-control"
        type="email"
        name="email"
        autoComplete="off"
      />
    </FormGroup>

    <div>
      <Button color="hbd" className="px-3" type="submit">
        {t(`sign-in-page.forgot-password.submit`, `envoyer`)}
      </Button>
    </div>
  </Form>
)

const withForm = reduxForm({
  form: 'resetPassword',
  onSubmit: ({ email }, dispatch, props) => {
    props.resetPassword(email)
      .then(
        ({ data: { resetPassword: { emailData }} }) => {
          dispatch(reset('resetPassword'))
          if (emailData) {
            console.log(JSON.parse(emailData))
            window.open(`/email?emailData=${encodeURIComponent(emailData)}`, '_blank')
          }
          toast.success(`L'email est parti ! Pense à vérifier tes spams :-)`)
        }
      )
  }
})

const withResetPassword =
  ChildComponent =>
    props => (
      <Mutation mutation={
        gql`mutation ResetPassword($email: String!) {
          resetPassword(email: $email) {
            success
            emailData
          }
        }`
      }>
        {
          resetPasswordMutation =>
            <ChildComponent {...props} resetPassword={email => resetPasswordMutation({ variables: { email } })} />
        }
      </Mutation>
    )

const enhance = compose(
  withResetPassword,
  withForm
)

export default enhance(ForgottenPasswordForm)