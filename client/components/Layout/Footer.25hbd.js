import React from 'react'
import {
  Container,
} from 'reactstrap'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import useMe from 'utils/useMe'

const Footer = () => {
  const me = useMe()
  return (
    <footer className="pb-3">
      <Container>
        <FooterContent>
          <ul className="list-inline mb-0 text-center">
            <li className="list-inline-item">
              <Link to="/contact/">Contact</Link>
            </li>
          </ul>
          <div className="mx-2"> | </div>
          <p className="mb-0  text-center">
            Créé par Zia | Site développé avec ❤ par Ugo et Ydrioss
            {
              me && me.isAdmin && (
                <>
                  {" "}
                  -
                  {" "}
                  <a className="link-unstyled" href="/admin">Admin</a>
                </>
              )
            }
          </p>
        </FooterContent>
      </Container>
    </footer>
  )
}

const FooterContent = styled.div.attrs(props => ({ className: "px-5 py-2" }))`
  display: flex;
  justify-content: center;
  &, & a {
    color: #8a7677;
  }
`

export default Footer
