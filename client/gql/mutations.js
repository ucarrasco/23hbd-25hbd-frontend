import gql from 'graphql-tag'

export const UPDATE_CHALLENGE_TYPE = gql`
  mutation UpdateChallengeType($participationId: ID!, $challengeType: ChallengeType!) {
    updateParticipation(
      participationId: $participationId
      challengeType: $challengeType
    ) {
      id
      challengeType
    }
  }
`