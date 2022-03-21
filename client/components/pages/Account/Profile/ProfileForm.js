import React from 'react'
import { Row, Col, Button, FormGroup, Label, Form } from 'reactstrap'
import { reduxForm, Field } from 'redux-form'
import Well, { WellFooter } from 'components/Well'
import { FieldInput as SimpleDateSelectorFieldInput } from 'components/SimpleDateSelector'
import moment from 'moment'
import { connect } from 'react-redux'
import { toast } from 'react-toastify'
import compose from 'utils/compose'
import withMutation from 'utils/withMutation'
import gql from 'graphql-tag'

const currentYear = moment().year()

let ProfileForm = ({ handleSubmit }) => (
  <Form onSubmit={handleSubmit}>
    <Well title="Infos">
      <Row>
        <Col xs={12} xl={5}>
          <FormGroup>
            <Label>
              {t(`account-page.profile-page.infos.email.label`)}
            </Label>
            <Field
              component="input"
              className="form-control"
              type="email"
              name="email"
              readOnly />
          </FormGroup>
        </Col>

        <Col xs={12} lg={8} xl={7}>
          <FormGroup>
            <Label>
              {t(`account-page.profile-page.infos.birth-date.label`)}
            </Label>
            <Field
              component={SimpleDateSelectorFieldInput}
              name="birthDate"
              yearsRange={[currentYear - 100, currentYear]}
              className="d-flex justify-content-between w-100"
            />
          </FormGroup>
        </Col>

        <Col xs={12} lg={6} xl={5}>
          <FormGroup>
            <Label>
              {t(`account-page.profile-page.infos.country.label`)}
            </Label>
            <Field
              component="input"
              className="form-control"
              type="text"
              name="country" />
          </FormGroup>
        </Col>

        <Col xs={12} lg={6} xl={7}>
          <FormGroup>
            <Label>
              {t(`account-page.profile-page.infos.webcam.label`)}
            </Label>
            <Field
              component="input"
              className="form-control"
              type="text"
              name="webcamUrl" />
          </FormGroup>
        </Col>

        <Col md={12}>
          <FormGroup>
            <Label>
              {t(`account-page.profile-page.infos.description.label`)}
            </Label>
            <Field
              component="textarea"
              rows="4"
              className="form-control"
              name="description" />
          </FormGroup>
        </Col>

      </Row>
      <WellFooter>
        <Button color="hbd" size="sm" className="px-4" type="submit">
          {t(`account-page.profile-page.infos.submit`)}
        </Button>
      </WellFooter>
    </Well>
  </Form>
)


const withForm = reduxForm({
  form: 'userInfo',
  onSubmit: ({ /*email,*/ country, description, webcamUrl, birthDate }, dispatch, { updateUserProfile }) => {
    updateUserProfile({
      // email,
      country,
      description,
      webcamUrl: webcamUrl || null,
      birthDate: birthDate.format("YYYY-MM-DD")
    }).then(_ => {
        toast.success(t(`account-page.profile-page.infos.done`))
      })
  }
})

const withUpdateUserProfile = withMutation(
  gql`
    mutation UpdateUserProfile(
      $userId: ID!,
      # $email: String,
      $country: String,
      $description: String,
      $webcamUrl: String,
      $birthDate: String
    ) {
      updateUser(
        userId: $userId,
        # email: $email,
        country: $country,
        description: $description,
        webcamUrl: $webcamUrl,
        birthDate: $birthDate
      ) {
        id
        # email
        country
        description
        webcamUrl
        birthDate
      }
    }
  `,
  (mutate, { userId }) => ({
    updateUserProfile: ({
      // email,
      country,
      description,
      webcamUrl,
      birthDate
    }) => mutate({
      variables: {
        userId,
        // email,
        country,
        description,
        webcamUrl,
        birthDate
      }
    })
  })
)

const withState = connect(
  (_, { user }) => {

    let { email, country, description, webcamUrl, birthDate } = user

    return {
      userId: user.id,
      initialValues: {
        email,
        country,
        description,
        webcamUrl,
        birthDate: moment(birthDate)
      }
    }
  }
)

const enhance = compose(
  withState,
  withUpdateUserProfile,
  withForm
)

export default enhance(ProfileForm)
