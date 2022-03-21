import { ME } from 'gql/queries'
import Cookies from 'js-cookie'

const logout = (apolloClient) => {
  Cookies.remove('accessToken')
  apolloClient.writeQuery({
    query: ME,
    data: {
      me: null
    }
  })
}

export default logout
