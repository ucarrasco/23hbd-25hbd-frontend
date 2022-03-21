import React from 'react'
import { FormGroup, Label, Button } from 'reactstrap'
import { reduxForm, Field } from 'redux-form'
import { toast } from 'react-toastify'
import withQueryResult from 'utils/withQueryResult'
import withMutation from 'utils/withMutation'
import gql from 'graphql-tag'
import compose from 'utils/compose'
import { formValueSelector } from 'redux-form'
import { connect } from 'react-redux'
import { features } from 'common/flavorConfig.hbd'
import RelevantEditionContext from './RelevantEditionContext'

class Comments extends React.Component {

  render() {
    let { handleSubmit, allowComments } = this.props
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '12vh' }}>
        <form className="text-center py-4" onSubmit={handleSubmit}>
          <FormGroup>
            <Label>
              {t(`account-page.comments-page.allow-comment.label`)}
            </Label>

            <div>
              <Label>
                <Field
                  name="allowComments"
                  component="input"
                  type="radio"
                  value={true}
                  parse={stringValue => JSON.parse(stringValue)}
                />{' '}
                {t(`account-page.comments-page.allow-comment.on`)}
              </Label>

              <Label className="ml-3">
                <Field
                  name="allowComments"
                  component="input"
                  type="radio"
                  value={false}
                  parse={stringValue => JSON.parse(stringValue)}
                />{' '}
                {t(`account-page.comments-page.allow-comment.off`)}
              </Label>
            </div>
          </FormGroup>

          {
            allowComments && (
              <FormGroup className="mt-2">
                <Label>
                  {t(`account-page.comments-page.enable-email-notifications.label`)}
                </Label>

                <div>
                  <Label>
                    <Field
                      name="notifyComments"
                      component="input"
                      type="radio"
                      value={true}
                      parse={stringValue => JSON.parse(stringValue)}
                    />{' '}
                    {t(`account-page.comments-page.enable-email-notifications.on`)}
                  </Label>

                  <Label className="ml-3">
                    <Field
                      name="notifyComments"
                      component="input"
                      type="radio"
                      value={false}
                      parse={stringValue => JSON.parse(stringValue)}
                    />{' '}
                    {t(`account-page.comments-page.enable-email-notifications.off`)}
                  </Label>
                </div>
              </FormGroup>
            )
          }
          <Button color="hbd" type="submit">
            {t(`account-page.comments-page.submit`)}
          </Button>
        </form>
      </div>
    )
  }
}


const selector = formValueSelector('commentsConfig')
const withState = connect(
  state => ({
    allowComments: selector(state, 'allowComments')
  })
)

const withForm = reduxForm({
  form: 'commentsConfig',
  onSubmit: ({ allowComments, notifyComments }, dispatch, { updateCommentsConfig }) => {
    updateCommentsConfig({
      allowComments,
      notifyComments
    })
      .then(_ => {
        toast.success(t(`account-page.comments-page.done`))
      })
  }
})

const withUpdateCommentsConfigMutation = withMutation(
  gql`
    mutation UpdateCommentsConfig($participationId: ID!, $allowComments: Boolean!, $notifyComments: Boolean) {
      updateParticipation(
        participationId: $participationId
        allowComments: $allowComments
        notifyComments: $notifyComments
      ) {
        id
        allowComments
        notifyComments
      }
    }
  `,
  (mutate, props) => ({
    updateCommentsConfig: ({
      allowComments,
      notifyComments
    }) => mutate({
      variables: {
        participationId: props.participationId,
        allowComments,
        notifyComments
      }
    })
  })
)

const withCommentsConfig = withQueryResult(
  gql`
    query CommentsConfig($userId: ID!, $editionId: ID!) {
      user(id: $userId) {
        id
        participation(editionId: $editionId) {
          id
          allowComments
          notifyComments
        }
      }
    }
  `,
  {
    variables: ({ userId, editionId }) => ({
      userId,
      editionId
    }),
    props: ({ user }) => ({
      initialValues: {
        allowComments: user.participation.allowComments,
        notifyComments: user.participation.notifyComments
      },
      participationId: user.participation.id
    })
  }
)

const withRelevantEditionId = ChildComponent => props => (
  <RelevantEditionContext.Consumer>
    {
      ({ relevantEdition }) => (
        <ChildComponent editionId={relevantEdition && relevantEdition.id} {...props} />
      )
    }
  </RelevantEditionContext.Consumer>
)

const enhance = compose(
  withRelevantEditionId,
  withCommentsConfig,
  withUpdateCommentsConfigMutation,
  withForm,
  withState
)

export default enhance(Comments)