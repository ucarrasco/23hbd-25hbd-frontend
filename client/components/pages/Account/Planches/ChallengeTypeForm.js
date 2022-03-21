import React from 'react'
import { Label, Form } from 'reactstrap'
import { reduxForm, Field } from 'redux-form'
import { connect } from 'react-redux'
import { toast } from 'react-toastify'
import { UPDATE_CHALLENGE_TYPE } from 'gql/mutations'
import withQueryResult from 'utils/withQueryResult'
import gql from 'graphql-tag'
import withMutation from 'utils/withMutation'
import compose from 'utils/compose'
import { policies } from 'common/flavorConfig.hbd'
import capitalize from 'lodash/capitalize'
import t from 'utils/t'

class Planches extends React.Component {

  render() {
    const {
      challengeType,
      canChangeChallengeType,
      handleSubmit
    } = this.props

    return (
      canChangeChallengeType
        ? (
          <Form onSubmit={handleSubmit}>
            <Label style={{ fontWeight: 'bold' }} className="mr-3">
              {t(`account-page.planches-page.challenge-type.label`)}
            </Label>
            {
              policies.challengeTypes.map(
                (challengeType, i) => (
                  <Label key={challengeType} className={i ? "ml-3" : undefined}>
                    <Field
                      name="challengeType"
                      component="input"
                      type="radio"
                      value={challengeType}
                    />{' '}
                    {t(`global.challenge-type.${challengeType}`)}
                  </Label>
                )
              )
            }

            <button type="submit" className="ml-4" disabled={!canChangeChallengeType}>
              {t(`account-page.planches-page.challenge-type.submit`)}
            </button>
          </Form>
        )
        : (
          <div className="mr-3">
            <strong>
              {t(`account-page.planches-page.current-challenge-type`)}
            </strong>
            {" "}
            {t(`global.challenge-type.${challengeType}`)}
          </div>
        )
    )
  }

}

const withForm = reduxForm({
  form: 'challengeType',
  onSubmit: ({ challengeType }, dispatch, { updateChallengeType }) => {
    updateChallengeType(challengeType)
      .then(_ => {
        toast.success(t(`account-page.planches-page.challenge-type.done`))
      })
  }
})

const withState = connect(
  (_, { challengeType}) => ({
    initialValues: {
      challengeType
    }
  })
)

const withUpdateChallengeType = withMutation(
  UPDATE_CHALLENGE_TYPE,
  (mutate, { participationId }) => ({
    updateChallengeType: challengeType => mutate({ 
      variables: {
        participationId,
        challengeType
      }
    })
  })
)

const withChallengeType = withQueryResult(
  gql`
    query ParticipationChallengeType($participationId: ID!) {
      participation(id: $participationId) {
        id
        pagesDone
        challengeType
      }
    }
  `,
  {
    variables: ({ participationId }) => ({ participationId }),
    props: ({ participation }) => ({
      challengeType: participation.challengeType,
      canChangeChallengeType: !participation.pagesDone
    })
  }
)

const enhance = compose(
  withChallengeType,
  withUpdateChallengeType,
  withState,
  withForm
)


export default enhance(Planches)