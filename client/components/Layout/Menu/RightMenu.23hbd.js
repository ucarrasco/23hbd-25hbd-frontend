import React from 'react'
import { ButtonGroup, Button } from 'reactstrap'
import { Link } from 'react-router-dom'
import { ME } from 'gql/queries'
import { Query } from '@apollo/react-components'
import logout from 'utils/logout'
import { ApolloConsumer } from '@apollo/react-hooks'
import styled from 'styled-components'

const RightMenu = ({ logged }) =>
  <RightMenuContainer className="m-0">
    {
      logged
        ? (
          <React.Fragment>
            <Link
              to="/compte/"
              className="btn btn-hbd">
              {t(`layout.right-menu.my-account`)}
            </Link>
            <ApolloConsumer>
              {
                client => (
                  <Button
                    color="hbd"
                    className="logout-button ml-2"
                    onClick={() => logout(client)}>
                    {t(`layout.right-menu.log-out`)}
                  </Button>
                )
              }
            </ApolloConsumer>
          </React.Fragment>
        )
      : (
        <React.Fragment>
          <Link
            to="/register/"
            className="btn btn-hbd">
            {t(`layout.right-menu.register`)}
          </Link>
          <Link
            to="/connexion/"
            className="btn btn-hbd ml-2 d-none d-sm-inline">
            {t(`layout.right-menu.sign-in`)}
          </Link>
        </React.Fragment>
      )
    }
  </RightMenuContainer>

const RightMenuContainer = styled.div`
  padding: 6.5px 0;
`

const withLogged = ChildComponent =>
  props =>
    <Query query={ME}>
      {
        ({ data, error, loading }) =>
          <ChildComponent {...props} logged={!!(!error && !loading && data && data.me)} />
      }
    </Query>

export default withLogged(RightMenu)
