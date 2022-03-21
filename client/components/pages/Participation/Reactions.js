import React, { useState, useMemo } from 'react'
import { UncontrolledTooltip } from 'reactstrap'
import styled from 'styled-components'
import ReactionBadge from 'utils/ReactionBadge'
import groupBy from 'lodash/fp/groupBy'
import toPairs from 'lodash/fp/toPairs'
import sortBy from 'lodash/fp/sortBy'
import { useQuery, useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import useMe from 'utils/useMe'
import { EMOTES, MAX_REACTIONS_PER_USER } from 'common/reactionsPolicy'
import cn from 'classnames'
import uniq from 'lodash/fp/uniq'

const ConnectedReactions = (props) => {
  const { participationId } = props
  const { data, loading, error } = useQuery(
    gql`
      query ParticipationReactions($participationId: ID!) {
        participation(id: $participationId) {
          id
          user {
            id
          }
          reactions {
            id
            emote
            author {
              id
              username
              avatarUrl
            }
          }
        }
      }
    `,
    { variables: { participationId }}
  )

  const [addReactionBase] = useMutation(
    gql`
      mutation AddReaction($participationId: ID!, $emote: String!) {
        addReaction(
          participationId: $participationId
          emote: $emote
        ) {
          id
          emote
          author {
            id
            username
            avatarUrl
          }
        }
      }
    `
  )
  const [deleteReactionBase] = useMutation(
    gql`
      mutation DeleteReaction($reactionId: ID!) {
        deleteReaction(reactionId: $reactionId) {
          id
        }
      }
    `
  )

  if (loading || error) return null
  const { reactions } = data.participation

  const addReaction = emote => addReactionBase({
    variables: { participationId, emote },
    refetchQueries: ['ParticipationReactions']
  })
  const deleteReaction = (reactionId) => deleteReactionBase({
    variables: { reactionId },
    refetchQueries: ['ParticipationReactions']
  })
  return (
    <Reactions
      {...props}
      reactions={reactions}
      addReaction={addReaction}
      deleteReaction={deleteReaction}
      participationUserId={data.participation.user.id}
    />
  )
}

const Reactions = ({
  className,
  reactions,
  addReaction,
  deleteReaction,
  participationUserId,
}) => {
  const me = useMe()
  const isMyParticipation = !!me && me.id === participationUserId
  const emotes = useMemo(
    () => {
      return EMOTES |> sortBy(e => reactions.filter(r => r.emote === e).length === 0)
    },
    []
  )

  const mines = reaction => me && reaction.author.id === me.id
  const canAddReaction = me && !isMyParticipation && reactions.filter(mines).length < MAX_REACTIONS_PER_USER
  const emotesToShow = (me && !isMyParticipation) ? emotes : emotes.filter(e => reactions.some(r => r.emote === e))

  return (
    <EmojisContainer className={cn(className, "reactions-container")}>
      {
        emotesToShow.map(
          emote => {
            const emoteReactions = reactions.filter(r => r.emote === emote)
            const myReaction = me ? emoteReactions.find(r => r.author.id === me.id) : null
            const checked = !!myReaction
            const onClick = (
              checked
                ? () => { deleteReaction(myReaction.id) }
                : () => { addReaction(emote) }
            )
            return (
              <React.Fragment key={emote}>
                <ReactionBadge
                  id={`emote-${emote}`}
                  emote={emote}
                  count={emoteReactions.length}
                  checked={checked}
                  onClick={onClick}
                  disabled={!myReaction && !canAddReaction}
                  className={cn({'has-any-reaction': !!reactions.length })}
                />
                {
                  emoteReactions.some(r => r.emote === emote) && (
                    <UncontrolledTooltip
                      placement="top"
                      target={`emote-${emote}`}
                      delay={{ show: 0, hide: 0 }}
                    >
                      <ReactionsList
                        reactions={emoteReactions}
                      />
                    </UncontrolledTooltip>
                  )
                }
              </React.Fragment>
            )
          }
        )
      }
    </EmojisContainer>
  )
}

const MAX_REACTIONS_LENGTH = 25

function ReactionsList({ reactions }) {
  return (
    <div className="text-left">
      {
        (
          reactions.length > MAX_REACTIONS_LENGTH
            ? reactions.slice(0, MAX_REACTIONS_LENGTH - 1)
            : reactions
        ).map(
          (reaction) => (
            <ReactionAuthor key={reaction.author.id}>
              {reaction.author.username}
            </ReactionAuthor>
          )
        )
      }
      {
        (reactions.length > MAX_REACTIONS_LENGTH) && (
          <ReactionAuthor key="moar">
            et {reactions.length - (MAX_REACTIONS_LENGTH - 1)} autres
          </ReactionAuthor>
        )
      }
    </div>
  )
}

const ReactionAuthor = styled.div`
  padding: 0 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const EmojisContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`

export default ConnectedReactions
