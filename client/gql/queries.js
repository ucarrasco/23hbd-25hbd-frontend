import gql from 'graphql-tag'

export const ME = gql`
  query Me {
    me {
      id
    }
  }
`

export const USER_PROFILE = gql`
  query UserProfile($userId: ID!) {
    user(id: $userId) {
      id
      username
      email
      avatarUrl
      birthDate
      country
      webcamUrl
      description
      links {
        id
        title
        url
      }
    }
  }
`
