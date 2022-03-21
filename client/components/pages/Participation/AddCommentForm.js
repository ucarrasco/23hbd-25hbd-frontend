import React, { useContext, useRef } from 'react'
import { Row, Col, Form, InputGroup, InputGroupAddon, Button } from 'reactstrap'
import gql from 'graphql-tag'
import cn from 'classnames'
import { reduxForm, Field, reset, formValueSelector } from 'redux-form'
import withMutation from 'utils/withMutation'
import compose from 'utils/compose'
import { Query } from '@apollo/react-components'
import { ME } from 'gql/queries'
import { toast } from 'react-toastify'
import ReCAPTCHA from 'react-google-recaptcha'
import { connect } from 'react-redux'
import { AnswerContext } from './Comments'
import { useMutation } from '@apollo/react-hooks'

function AddCommentForm({ className, style, handleSubmit, isLogged, showRecaptcha, canSubmit }) {
  const answerCtx = useContext(AnswerContext)
  const isAnswer = !!answerCtx
  return (
    <Form className={cn({ "px-sm-5": !isAnswer }, className)} style={style} onSubmit={handleSubmit}>
      {
        !isLogged && (
          <Row>
            <Col md={4}>
              <InputGroup size="sm">
                <InputGroupAddon addonType="prepend">{`${t(`participation-page.comments.add-comment.name.label`)}*`}</InputGroupAddon>
                <Field
                  component="input"
                  type="text"
                  name="name"
                  className="form-control"
                />
              </InputGroup>
            </Col>
            <Col md={4}>
              <InputGroup size="sm">
                <InputGroupAddon addonType="prepend">{`${t(`participation-page.comments.add-comment.email.label`)}*`}</InputGroupAddon>
                <Field
                  component="input"
                  type="email"
                  name="email"
                  className="form-control"
                />
              </InputGroup>
            </Col>
            <Col md={4}>
              <InputGroup size="sm">
                <InputGroupAddon addonType="prepend">{t(`participation-page.comments.add-comment.website.label`)}</InputGroupAddon>
                <Field
                  component="input"
                  type="text"
                  name="website"
                  className="form-control"
                />
              </InputGroup>
            </Col>
          </Row>
        )
      }
      <div>
        <Row>
          <Col {...(isAnswer ? { md: 10, lg: 8 } : {})}>
            <Field
              component="textarea"
              name="content"
              className="form-control mt-3"
              rows={isAnswer ? 3 : 4}
              autoFocus={isAnswer}
            />
          </Col>
        </Row>
        {
          !isLogged && (
            <div className={cn("justify-content-center my-3", showRecaptcha ? "d-flex" : "d-none")}>
              <Field
                name="recaptcha"
                component={ReduxFormedReCAPTCHA}
                sitekey={process.env.RECAPTCHA_SITE_KEY}
              />
            </div>
          )
        }
        <div className={cn({ "text-center": !isAnswer }, isAnswer ? "mt-2" : "mt-3")}>
          <Button
            color="hbd"
            type="submit"
            disabled={!canSubmit}
            size={isAnswer ? "sm" : undefined}
          >
            {
              isAnswer
                ? t(`participation-page.comments.add-comment.submit-answer`)
                : t(`participation-page.comments.add-comment.submit`)
            }
          </Button>
          {
            isAnswer && (
              <Button color="" onClick={answerCtx.cancel} size="sm">
                {t(`participation-page.comments.add-comment.cancel-answer`)}
              </Button>
            )
          }
        </div>
      </div>
    </Form>
  )
}


class ReduxFormedReCAPTCHA extends React.Component {

  constructor(props) {
    super(props)
    this.recaptchaRef = React.createRef()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.input.value && !this.props.input.value)
      this.recaptchaRef.current.reset()
  }

  render() {
    const { input: { value, onChange }, meta, ...otherProps } = this.props
    return (
      <ReCAPTCHA
        ref={this.recaptchaRef}
        onChange={onChange}
        {...otherProps}
      />
    )
  }
}

const guestSelector = formValueSelector('addGuestComment')
const withShowRecaptcha = connect(
  state => ({
    showRecaptcha: !!guestSelector(state, 'content'),
    canSubmit: !!(
      guestSelector(state, 'recaptcha')
        && guestSelector(state, 'name')
        && guestSelector(state, 'email')
        && guestSelector(state, 'content')
    )
  })
)

const withGuestForm = reduxForm({
  form: "addGuestComment",
  onSubmit: ({ name, email, website, content, recaptcha }, dispatch, { addGuestComment, onCommentSent }) => {
    addGuestComment({
      name,
      email,
      website,
      content,
      recaptcha: recaptcha
    })
      .then(
        () => {
          if (onCommentSent) onCommentSent()
          toast.success(t(`participation-page.comments.add-comment.done`))
          dispatch(reset("addGuestComment"))
        }
      )
  }
})

const withAddGuestComment = withMutation(
  gql`
    mutation AddGuestComment(
      $participationId: ID!
      $comment: GuestCommentInput!
    ) {
      addGuestComment(
        participationId: $participationId
        comment: $comment
      ) {
        id
        guestAuthor {
          name
          website
        }
        content
        date
      }
    }
  `,
  (mutate, { participationId }) => ({
    addGuestComment: ({ name, email, website, content, recaptcha }) =>
      mutate({
        variables: {
          participationId,
          comment: {
            name,
            email,
            website,
            content,
            recaptcha
          }
        },
        refetchQueries: ['ParticipationComments']
      })
  })
)

const guestEnhance = compose(
  withAddGuestComment,
  withGuestForm,
  withShowRecaptcha
)
const AddGuestCommentForm = guestEnhance(AddCommentForm)


const withUserCanSubmit = connect(
  (state, { form }) => ({
    canSubmit: !!formValueSelector(form)(state, 'content')
  })
)

const withUserForm = reduxForm({
  onSubmit: ({ content }, dispatch, { addUserComment, onCommentSent, form }) => {
    addUserComment(content)
      .then(
        () => {
          if (onCommentSent) onCommentSent()
          toast.success(t(`participation-page.comments.add-comment.done`))
          dispatch(reset(form))
        }
      )
  }
})

const withAddUserComment = ChildComponent => props => {
  const { participationId } = props
  const answerCtx = useContext(AnswerContext)
  const [mutate] = useMutation(
    gql`
      mutation AddUserComment(
        $participationId: ID!
        $comment: UserCommentInput!
        $answeredCommentId: ID
      ) {
        addComment(
          participationId: $participationId
          comment: $comment
          answeredCommentId: $answeredCommentId
        ) {
          id
          author {
            id
            username
            avatarUrl
          }
          content
          date
        }
      }
    `
  )
  const addUserComment = content => {
    return mutate({
      variables: {
        participationId,
        comment: {
          content
        },
        answeredCommentId: answerCtx ? answerCtx.commentId : undefined,
      },
      refetchQueries: ['ParticipationComments'],
    })
  }

  return (
    <ChildComponent
      {...props}
      addUserComment={addUserComment}
      form={answerCtx ? `addAnswerTo${answerCtx.commentId}` : `addUserComment`}
    />
  )
}

const userEnhance = compose(
  withAddUserComment,
  withUserForm,
  withUserCanSubmit
)
const AddUserCommentForm = userEnhance(AddCommentForm)



export default (props) => (
  <Query query={ME}>
    {
      ({ data, error, loading }) => {
        const isLogged = !!(!error && !loading && data && data.me)
        const AddCommentForm = isLogged ? AddUserCommentForm : AddGuestCommentForm
        return (
          <AddCommentForm
            {...props}
            isLogged={isLogged}
          />
        )
      }
    }
  </Query>
)
