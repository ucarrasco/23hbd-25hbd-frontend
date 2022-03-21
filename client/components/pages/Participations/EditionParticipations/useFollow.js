import gql from 'graphql-tag'
import { useQuery, useMutation } from '@apollo/react-hooks'

function useFollow() {
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
    `
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
    `
  )
  const setFollowed = (participation, followed) => {
    if (followed) {
      followUser({
        variables: { userId: participation.user.id },
        optimisticResponse: {
          __typename: "Mutation",
          followUser: {
            __typename: "User",
            id: me.id,
            followedUsers: [
              ...me.followedUsers,
              {
                __typename: "User",
                id: participation.user.id,
              }
            ]
          }
        },
      })
    }
    else {
      unfollowUser({
        variables: { userId: participation.user.id },
        optimisticResponse: {
          __typename: "Mutation",
          unfollowUser: {
            __typename: "User",
            id: me.id,
            followedUsers: me.followedUsers.filter(({ id }) => id !== participation.user.id)
          }
        },
      })
    }
  }
  return [setFollowed]
}

export default useFollow
