import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

export default () => {
  const { data: { me } } = useQuery(
    gql`
      query Me {
        me {
          id
          slug
          isAdmin
        }
      }
    `,
    {
      fetchPolicy: 'cache-only'
    }
  )
  return me
}