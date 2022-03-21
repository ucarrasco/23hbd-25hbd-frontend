import React from 'react'
import { Row, Col, Button, FormGroup, Label, Form } from 'reactstrap'
import { reduxForm, Field, formValueSelector } from 'redux-form'
import Well, { WellFooter } from 'components/Well'
import { connect } from 'react-redux'
import { toast } from 'react-toastify'
import withQueryResult from 'utils/withQueryResult'
import withMutation from 'utils/withMutation'
import gql from 'graphql-tag'
import compose from 'utils/compose'

const EditParticipationForm = ({
  participation: { edition: { year: editionYear }},
  handleSubmit,
  withTeam,
  inGathering
}) => {
  return (
    <Form onSubmit={handleSubmit}>
      <Well title={t(`account-page.profile-page.participation.title`, { year: editionYear })}>
        <Row>
          <Col lg={6}>

            <FormGroup>
              <Label>
                {t(`account-page.profile-page.participation.team.label`)}
              </Label>

              <div>
                <Label>
                  <Field
                    name="withTeam"
                    component="input"
                    type="radio"
                    value="0"
                  />{' '}
                  {t(`account-page.profile-page.participation.team.without-team.label`)}
                </Label>

                <Label className="ml-3">
                  <Field
                    name="withTeam"
                    component="input"
                    type="radio"
                    value="1"
                  />{' '}
                  {t(`account-page.profile-page.participation.team.with-team.label`)}
                </Label>
              </div>
            </FormGroup>

            <FormGroup>
              <Label>
                {t(`account-page.profile-page.participation.gathering.label`)}
              </Label>
              <div>
                <Label>
                  <Field
                    name="inGathering"
                    component="input"
                    type="radio"
                    value="0"
                  />{' '}
                  {t(`account-page.profile-page.participation.gathering.no-gathering.label`)}
                </Label>

                <Label className="ml-3">
                  <Field
                    name="inGathering"
                    component="input"
                    type="radio"
                    value="1"
                  />{' '}
                  {t(`account-page.profile-page.participation.gathering.in-gathering.label`)}
                </Label>
              </div>

            </FormGroup>

          </Col>

          <Col lg={6}>

            <FormGroup>
              <Label>
                {t(`account-page.profile-page.participation.teamates.label`)}
              </Label>
              <Field
                component="input"
                className="form-control"
                type="text"
                name="teamates"
                disabled={!withTeam} />
            </FormGroup>

            <FormGroup>
              <Label>
                {t(`account-page.profile-page.participation.gathering-name.label`)}
              </Label>
              <Field
                component="input"
                className="form-control"
                type="text"
                name="gathering.name"
                disabled={!inGathering} />
            </FormGroup>

            <FormGroup>
              <Label>
                {t(`account-page.profile-page.participation.town.label`)}
              </Label>
              <Field
                component="input"
                className="form-control"
                type="text"
                name="gathering.town"
                disabled={!inGathering} />
            </FormGroup>

          </Col>
        </Row>
        <WellFooter>
          <Button color="hbd" size="sm" className="px-4" type="submit">
            {t(`account-page.profile-page.participation.submit`)}
          </Button>
        </WellFooter>
      </Well>
    </Form>
  )
}

const PARTICIPATION_ATTRIBUTES = `
  id
  challengeType
  withTeam
  teamates
  inGathering
  gathering {
    name
    town
  }
  allowComments
  pagesDone
  pagesGoal
  achievement
  pages {
    url
  }
`

const selector = formValueSelector('participationToRelevantEdition')

const withForm = reduxForm({
  form: 'participationToRelevantEdition',
  onSubmit: ({ withTeam, teamates, inGathering, gathering }, dispatch, { updateParticipation }) => {
    withTeam = !!parseInt(withTeam)
    inGathering = !!parseInt(inGathering)

    updateParticipation({
      withTeam,
      teamates: (withTeam && teamates) || null,
      inGathering,
      gathering: inGathering ? {
        name: (gathering && gathering.name) || "",
        town: (gathering && gathering.town) || ""
      } : null
    })
    .then(_ => {
      toast.success(t(`account-page.profile-page.participation.done`))
    })
  }
})

const withUpdateParticipation = withMutation(
  gql`
    mutation UpdateParticipation(
      $participationId: ID!,
      $withTeam: Boolean
      $teamates: String
      $inGathering: Boolean
      $gathering: GatheringInput
      $allowComments: Boolean
      $challengeType: ChallengeType
    ) {
      updateParticipation(
        participationId: $participationId
        withTeam: $withTeam
        teamates: $teamates
        inGathering: $inGathering
        gathering: $gathering
        allowComments: $allowComments
        challengeType: $challengeType
      ) {
        ${PARTICIPATION_ATTRIBUTES}
      }
    }
  `,
  (mutate, { participationId }) => ({
    updateParticipation: (values) =>
      mutate({
        variables: { participationId, ...values }
      })
  })
)

const withParticipation = withQueryResult(
  gql`
    query Participation($participationId: ID!) {
      participation(id: $participationId) {
        ${PARTICIPATION_ATTRIBUTES}
        edition {
          id
          year
        }
      }
    }
  `,
  {
    variables: ({ participationId }) => ({ participationId }),
    props: ({ participation }) => ({
      participation,
      initialValues: {
        withTeam: participation.withTeam ? '1' : '0',
        teamates: participation.teamates,
        inGathering: participation.inGathering ? '1' : '0',
        gathering: participation.gathering ? {
          name: participation.gathering.name,
          town: participation.gathering.town
        } : undefined
      }
    })
  }
)

const withState = connect(
  state => ({
    withTeam: !!parseInt(selector(state, 'withTeam')),
    inGathering: !!parseInt(selector(state, 'inGathering'))
  })
)

const enhance = compose(
  withState,
  withParticipation,
  withUpdateParticipation,
  withForm
)

export default enhance(EditParticipationForm)

