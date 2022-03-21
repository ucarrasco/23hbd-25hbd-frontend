import React, { useState } from 'react'
import gql from 'graphql-tag'
import Star from './Star'
import { useQuery, useMutation } from '@apollo/react-hooks'
import styled, { keyframes, css } from 'styled-components'

function FollowStatus({ userId, ...props }) {
  const { data: { me } } = useQuery(
    gql`
      query Follows {
        me {
          id
          followedUsers {
            id
          }
        }
      }
    `,
    { fetchPolicy: 'cache-only' }
  )
  const [followUser] = useMutation(
    gql`
      mutation FollowUser($userId: ID!) {
        followUser(userId: $userId) {
          id
          followedUsers {
            id
          }
        }
      }
    `,
    {
      variables: { userId },
      optimisticResponse: {
        __typename: "Mutation",
        followUser: {
          __typename: "User",
          id: me.id,
          followedUsers: [
            ...me.followedUsers,
            {
              __typename: "User",
              id: userId,
            }
          ]
        }
      },
    }
  )
  const [unfollowUser] = useMutation(
    gql`
      mutation UnfollowUser($userId: ID!) {
        unfollowUser(userId: $userId) {
          id
          followedUsers {
            id
          }
        }
      }
    `,
    {
      variables: { userId },
      optimisticResponse: {
        __typename: "Mutation",
        unfollowUser: {
          __typename: "User",
          id: me.id,
          followedUsers: me.followedUsers.filter(({ id }) => id !== userId)
        }
      },
    }
  )
  const following = me.followedUsers.some(followedUser => followedUser.id === userId)
  const onClick = async e => {
    if (following) {
      unfollowUser()
      setAnimate(true)
    }
    else {
      followUser()
      setAnimate(true)
    }
  }
  const [animate, setAnimate] = useState(false)
  return (
    <>
      <Star
        active={following}
        onClick={onClick}
        {...props}
      />
      <HPLossFeedback animate={animate}>
        <span onAnimationEnd={() => { setAnimate(false) }}>
          {
            following
              ? t(`feedback.follow-status.followed`)
              : t(`feedback.follow-status.unfollowed`)
          }
        </span>
      </HPLossFeedback>
    </>
  )
}

const HPLossAnimation = keyframes`
  from {
    transform: translate(0px, 0px);
    opacity: 1;
  }

  80% {
    opacity: 0.4;
  }

  to {
    transform: translate(0px, -10px);
    opacity: 0;
  }
`


const HPLossFeedback = styled.div`
  display: inline-block;
  width: 0;
  overflow: visible;
  > span {
    width: 170px;
    display: inline-block;
    text-align: left;
    font-size: 12px;
    color: #232323;
    color: #97979c;
    vertical-align: top;
    margin-left: 8px;
    opacity: 0;
    ${({ animate }) => animate && css`animation: ${HPLossAnimation} 0.7s linear;`}
  }
`

export default FollowStatus
