import React from 'react'
import {
  Form,
  FormGroup,
  Label,
  Button
} from 'reactstrap'
import { Field, reduxForm } from 'redux-form'
import compose from 'utils/compose'
import { ME } from 'gql/queries'
import { Redirect } from 'react-router'
import { toast } from 'react-toastify'
import { defaultErrorMessage } from 'utils/texts'
import get from 'lodash/fp/get'
import Cookies from 'js-cookie'
import { useApolloClient } from '@apollo/react-hooks'
import changeLanguage from 'utils/changeLanguage'
import i18next from 'i18next'
import useMe from 'utils/useMe'
import { SignIn } from './SignIn.gql'

let SignInForm = ({ handleSubmit }) => {
  if (useMe()) return <Redirect to="/compte/" />
  return (
    <Form id="sign-in" className="bg-light" onSubmit={handleSubmit}>
      <FormGroup>
        <Label for="pseudo" className="d-block text-center mb-0">
          {t(`sign-in-page.username.label`, `Pseudo`)}
        </Label>

        <Field
          component="input"
          className="form-control"
          id="pseudo"
          type="text"
          name="pseudo"
        />
      </FormGroup>

      <FormGroup>
        <Label for="password" className="d-block text-center mb-0">
          {t(`sign-in-page.password.label`, `Mot de passe`)}
        </Label>
        <Field
          component="input"
          className="form-control"
          type="password"
          name="password"
          id="password"
        />
      </FormGroup>

      <div className="text-center">
        <Button color="hbd" className="px-3" type="submit">
          {t(`sign-in-page.submit`, `Connexion`)}
        </Button>
      </div>
    </Form>
  )
}

const withForm = reduxForm({
  form: 'signIn',
  onSubmit: ({ pseudo, password }, dispatch, { signIn }) => {
    signIn(pseudo, password)
  }
})

export function useSignIn() {
  const client = useApolloClient()
  return async (username, password) => {
    try {
      const { data } = await client.query({
        query: SignIn,
        variables: { username, password }
      })
      Cookies.set('accessToken', data.signIn.token, { expires: 45 })

      const userLanguage = data.signIn.user.preferences.language
      const currentLanguage = i18next.language
      if (userLanguage && userLanguage !== currentLanguage)
        changeLanguage(userLanguage) // triggers a browser page change
      else {
        client.writeQuery({
          query: ME,
          data: {
            me: {
              id: data.signIn.user.id,
              __typename: "User"
            },
          },
        })
      }
    }
    catch(error) {
      console.error(error)
      if (!(error |> get("graphQLErrors.0.extensions.exception.toast")))
        toast.error(defaultErrorMessage)
    }
  }
}

export const withSignIn = function(ChildComponent) {
  return props => <ChildComponent {...props} signIn={useSignIn()} />
}

const enhance = compose(
  withSignIn,
  withForm,
)

export default enhance(SignInForm)
