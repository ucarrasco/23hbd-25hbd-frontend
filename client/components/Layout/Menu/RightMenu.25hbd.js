import React from 'react'
import { Link } from 'react-router-dom'
import { ME } from 'gql/queries'
import { Query } from '@apollo/react-components'
import logout from 'utils/logout'
import { useApolloClient } from '@apollo/react-hooks'
import useRouter from 'utils/useRouter'
import useMe from 'utils/useMe'

const RightMenu = ({ logged }) => {
  const client = useApolloClient()
  const { location: { pathname, search }} = useRouter()
  const me = useMe()
  return (
    <ul className="mb-0 h25-right-menu">
      {
        me
          ? (
            <React.Fragment>
              <li className={pathname.match(/^\/compte\//) ? 'active' : undefined}>
                <Link to="/compte/" className="link-unstyled">
                  {t(`layout.right-menu.my-account`)}
                </Link>
              </li>
              <li className="logout-item">
                <a href="" className="link-unstyled"
                  onClick={(e) => { e.preventDefault(); logout(client) }}>
                  {t(`layout.right-menu.log-out`)}
                </a>
              </li>
            </React.Fragment>
          )
        : (
          <React.Fragment>
            <li className={pathname.match(/^\/register\//) ? 'active' : undefined}>
              <Link to="/register/" className="link-unstyled">
                {t(`layout.right-menu.register`)}
              </Link>
            </li>
            <li className={pathname.match(/^\/connexion\//) ? 'active' : undefined}>
              <Link to="/connexion/" className="link-unstyled">
                {t(`layout.right-menu.sign-in`)}
              </Link>
            </li>
          </React.Fragment>
        )
      }
    </ul>
  )
}

export default RightMenu
