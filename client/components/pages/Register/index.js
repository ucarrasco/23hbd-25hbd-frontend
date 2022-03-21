import React, { useState } from 'react'
import {
  Form,
  FormGroup,
  Label,
  Row,
  Col,
  Button,
  FormFeedback,
  Input
} from 'reactstrap'
import moment from 'moment'
import { reduxForm, reset } from 'redux-form'
import Field from 'utils/BetterField'
import withMutation from 'utils/withMutation'
import gql from 'graphql-tag'
import SimpleDateSelector from 'components/SimpleDateSelector'
import { Link } from 'react-router-dom'
import { Query } from '@apollo/react-components'
import { Redirect } from 'react-router'
import { EditionParticipations as EDITION_PARTICIPATIONS_QUERY } from '../Participations/operations.gql'
import EDITION_PARTICIPATIONS_COUNT_QUERY from 'gql/EditionParticipationsCount.gql'
import { strings } from 'common/flavorConfig.hbd'
import { useQuery } from '@apollo/react-hooks'
import useMe from 'utils/useMe'
import './register.scss'
import i18next from 'i18next'
import { Trans } from 'react-i18next'

const now = moment()

let Register = ({ handleSubmit }) => {
  const [ confirmedUser, setConfirmedUser ] = useState(null)
  const me = useMe()
  const { data, loading, error } = useQuery(gql`
    query SubscribableEdition {
      currentEdition {
        id
        year
        status {
          usersCanRegister
        }
      }
      incomingEdition {
        id
        year
        status {
          usersCanRegister
        }
      }
    }
  `)
  if (me) return <Redirect to="/compte/" />
  if (loading || error) return null
  const editionToRegisterFor = [data.incomingEdition, data.currentEdition].filter(edition => edition && edition.status.usersCanRegister)[0]

  if (confirmedUser)
    return (
      <div className="text-center py-5">
        <h1 className="mb-4">
          {t(`register-page.all-good.title`)}
        </h1>
        <div>
          {t(`register-page.all-good.text`, { email: confirmedUser.email })}
        </div>
      </div>
    )
  return (
    <div className="py-4">
      <Row>
        <Col
          lg={{ size: 4, offset: 4 }}
          md={{ size: 6, offset: 3 }}
          sm={{ size: 8, offset: 2 }}
          >

          <h1 className="register-title text-center">
            {t(`register-page.title`, editionToRegisterFor ? { context: 'active-edition', year: editionToRegisterFor.year } : { context: 'no-active-edition' })}
          </h1>

          <Row id="register" className="mb-5 mt-4">
            <Col
              sm={{ size: 10, offset: 1 }}
              >
              <Form onSubmit={
                (e) => {
                  const res = handleSubmit(e)
                  if (res instanceof Promise)
                    res.then(
                      ({ user }) => {
                        setConfirmedUser(user)
                      }
                    )
                  }
                }
              >
                <div className="py-4">
                  <FormGroup>
                    <Label for="pseudo" className="d-block mb-0">
                      {t(`register-page.username.label`)}
                    </Label>
                    <Field
                      component={renderField}
                      className="form-control"
                      type="text"
                      name="pseudo"
                      id="pseudo"
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label for="email" className="d-block mb-0">
                      {t(`register-page.email.label`)}
                    </Label>
                    <Field
                      component={renderField}
                      className="form-control"
                      type="email"
                      name="email"
                      id="email"
                    />
                  </FormGroup>

                  <FormGroup className="form-inline">
                    <Label className="d-block mb-0 w-100">
                      {t(`register-page.birth-date.label`)}
                    </Label>

                    <Field name="birthDate">
                      {
                        ({ input: { value, onChange }, meta: { touched, error } }) => (
                          <React.Fragment>
                            <SimpleDateSelector
                              value={value}
                              onChange={onChange}
                              yearsRange={[now.year() - 100, now.year()]}
                              className="d-flex justify-content-between w-100"
                              invalid={touched && !!error}
                            />
                            { touched && <FormFeedback>{error}</FormFeedback> }
                          </React.Fragment>
                        )
                      }
                    </Field>
                  </FormGroup>
                  <div className="text-center mt-4">
                    <Button color="primary" className="px-4" type="submit">
                      {t(`register-page.submit`)}
                    </Button>
                  </div>
                </div>

              </Form>
            </Col>
          </Row>

        </Col>
      </Row>

      {
        editionToRegisterFor && (
          <Row>
            <Col
              lg={{ size: 6, offset: 3 }}
              md={{ size: 8, offset: 2 }}
              sm={{ size: 10, offset: 1 }}
            >
              <div className="post-it-info">
                {/* To understand this shitty API, visit https://github.com/arkross/arkross.github.io/wiki/Using-react-i18next-Trans-Component */}
                <Trans i18nKey="register-page.already-registered-tip">
                  <div>
                    <strong>Note :</strong>Si tu as déjà participé par le passé, tu n'as pas besoin de te réinscrire.
                  </div>
                  <div>
                    <Link to="/connexion/">Connecte-toi</Link> à ton compte et active l'édition {{year: editionToRegisterFor.year}}.
                  </div>
                </Trans>
              </div>
            </Col>
          </Row>
        )
      }
    </div>
  )
}

const renderField = ({
  input,
  meta: { touched, error, warning },
  ...props
}) => (
  <div>
    <Input
      {...input}
      {...props}
      invalid={touched && !!error}
    />
    {touched && <FormFeedback>{error}</FormFeedback>}
  </div>
)

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

const withForm = reduxForm({
  form: 'register',
  initialValues: {
    birthDate: now.clone().subtract(15, "years")
  },
  onSubmit: ({ pseudo, email, birthDate }, dispatch, { register }) => (
    register(pseudo, email, birthDate.format("YYYY-MM-DD"))
      .then(({ data: { register: { user, emailData }} }) => {
        dispatch(reset('register'))
        if (emailData) {
          console.log(JSON.parse(emailData))
          window.open(`/email?emailData=${encodeURIComponent(emailData)}`, '_blank')
        }
        return { user: { email } }
      })
  ),
  validate: ({ pseudo, email, birthDate }) => {
    const errors = {}
    if (!pseudo || !pseudo.trim())
      errors.pseudo = `Entre un pseudo`
    if (!email || !email.trim())
      errors.email = `Entre ton email`
    else if (!email.match(EMAIL_REGEX))
      errors.email = `Email invalide`
    if (!birthDate)
      errors.birthDate = `Entre ta date de naissance`
    if (!moment(birthDate).isValid() || moment(birthDate).isAfter(now))
      errors.birthDate = `Date de naissance invalide`
    return errors
  }
})

const withRegister = withMutation(
  gql`
    mutation Register($username: String!, $email: String!, $birthDate: String!, $language: String) {
      register(
        username: $username
        email: $email
        birthDate: $birthDate
        language: $language
      ) {
        user {
          id
        }
        participation {
          id
          edition {
            id
          }
        }
        emailData
      }
    }
  `,
  mutate => ({
    register: (username, email, birthDate) =>
      mutate({
        variables: { username, email, birthDate, language: i18next.language },
        toastOnError: true,
        refetchQueries: ({ data }) => {
          return (
            data.register.participation
              ? [
                {
                  query: EDITION_PARTICIPATIONS_QUERY,
                  variables: {
                    editionId: data.register.participation.edition.id
                  }
                },
                {
                  query: EDITION_PARTICIPATIONS_COUNT_QUERY,
                  variables: {
                    editionId: data.register.participation.edition.id
                  }
                }
              ]
              : []
          )
        }
      })
  })
)

export default withRegister(withForm(Register))
