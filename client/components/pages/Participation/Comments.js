import React, { useState, createContext, useContext } from 'react'
import AddCommentForm from './AddCommentForm'
import moment from 'moment'
import withQueryResult from 'utils/withQueryResult'
import gql from 'graphql-tag'
import userPlaceHolderImage from 'assets/images/user-placeholder.hbd.jpg'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'
import './comments.scss'
import { Button } from 'reactstrap'
import useMe from 'utils/useMe'
import useRouter from 'utils/useRouter'
import cn from 'classnames'
import { useApolloClient } from '@apollo/react-hooks'
import ReplyIcon from '-!react-svg-loader!assets/images/reply.svg'

const FormatCommentText = ({ children }) => (
  children.split("\n").map(
    (line, i, lines) => (
      <React.Fragment key={i}>
        { line }
        { (i < lines.length - 1) ? <br /> : null }
      </React.Fragment>
    )
  )
)

const Comments = ({ participationId, comments, match: { params: { year }}, style, className }) => {
  return (
    <div style={style} className={className}>
      {
        !!comments.length && (
          <div className="mb-5">
            {
              comments.map(
                comment => (
                  <Comment
                    key={comment.id}
                    comment={comment}
                  />
                )
              )
            }
          </div>
        )
      }
      <AddCommentForm participationId={participationId} />
    </div>
  )
}

const AnswersContext = createContext()

function Comment({ comment: { id, author, guestAuthor, content, date, __typename: type, answers, participationId } }) {
  const { match: { params: { year }} } = useRouter("/participants/:year/")
  const me = useMe()
  const logged = !!me
  const [answer, setAnswer] = useState(false)
  const isAnswer = !!useContext(AnswersContext)
  const client = useApolloClient()
  const participationUserId = client.readFragment({
    id: `Participation:${participationId}`,
    fragment: gql`
      fragment ParticipationUserId on Participation {
        user {
          id
        }
      }
    `
  }).user.id
  const canAnswer = (
    !isAnswer
    &&
    logged
    &&
    (
      participationUserId === me.id
      ||
      (
        answers.length !== 0
        &&
        author
        &&
        author.id === me.id
      )
    )
  )
  const wrapWithUserLinkIfApplicable = children => (
    type === 'UserComment'
      ? (
        <Link to={`/u/${author.id}/?preferred_year=${year}`} className="link-unstyled">{children}</Link>
      )
      : children
  )
  return (
    <div key={id} className={cn("d-flex participation-comment", { answer: isAnswer })}>
      {
        wrapWithUserLinkIfApplicable(
          <img
            src={(type === 'UserComment' && author.avatarUrl) || userPlaceHolderImage}
            alt=""
            className="author-thumb"
          />
        )
      }
      <div style={{ flex: 1 }}>
        <div className="comment-author">
          {
            type === 'UserComment'
              ? wrapWithUserLinkIfApplicable(
                <strong>{author.username}</strong>
              )
              : (
                guestAuthor.website
                  ? <a href={guestAuthor.website} className="link-unstyled"><strong>{guestAuthor.name}</strong></a>
                  : <strong>{guestAuthor.name}</strong>
              )
          }
          {" "}
          <span>{moment(date).format("LLL")}</span>
        </div>
        <div className="comment-caret" />
        <p className="comment-content">
          <FormatCommentText>
            { content }
          </FormatCommentText>
        </p>
        {
          !isAnswer && answers.length !== 0 && (
            <AnswersContext.Provider value>
              {
                answers.map(
                  answer => (
                    <Comment key={answer.id} comment={answer} />
                  )
                )
              }
            </AnswersContext.Provider>
          )
        }
        {
          canAnswer && (
            answer
              ? (
                <AnswerContext.Provider value={{ commentId: id, cancel() { setAnswer(false) } }}>
                  <AddCommentForm participationId={participationId} onCommentSent={() => { setAnswer(false) }} />
                </AnswerContext.Provider>
              )
              : (
                <div className={cn("comment-actions mt-1", { "already-has-answers": answers.length !== 0 })}>
                  <Button color="light" size="xs" className="comment-action" onClick={() => { setAnswer(true) }}>
                    <ReplyIcon height="1.4em" className="mr-1" />
                    <span>
                      {
                        (!isAnswer && answers.length !== 0)
                          ? t(`participation-page.comments.add-answer-cta`)
                          : t(`participation-page.comments.answer-cta`)
                      }
                    </span>
                  </Button>
                </div>
              )
          )
        }
      </div>
    </div>
  )
}

export const AnswerContext = createContext()

const withComments = withQueryResult(
  gql`
    query ParticipationComments($participationId: ID!) {
      participation(id: $participationId) {
        id
        comments {
          id
          ...CommentData
          answers {
            id
            ...CommentData
          }
        }
      }
    }
    fragment CommentData on Comment {
      id
      content
      date
      participationId
      ... on UserComment {
        author {
          id
          username
          avatarUrl
        }
      }
      ... on GuestComment {
        guestAuthor {
          name
          website
        }
      }
    }
  `,
  {
    variables: ({ participationId }) => ({ participationId }),
    props: ({ participation }) => ({ comments: participation.comments })
  }
)

export default withRouter(withComments(Comments))
