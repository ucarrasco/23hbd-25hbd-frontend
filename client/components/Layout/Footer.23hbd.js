import React from 'react'
import {
  Container,
} from 'reactstrap'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { getLanguageChangeUrl } from 'utils/changeLanguage'
import { SUPPORTED_LANGUAGES, LANGUAGE_INFO } from 'common/locales'
import useMe from 'utils/useMe'

const Footer = () => {
  const me = useMe()
  return (
    <FooterContainer>
      <Container className="text-center">
        Developpé avec ♥ par Ugo & Ydrioss - <Link to="/contact/" className="link-unstyled">Contact</Link>
        {" "}-{" "}
        {
          SUPPORTED_LANGUAGES.map(
            (language, i) => (
              <React.Fragment key={language}>
                {!!i && " "}
                <a className="link-unstyled" href={getLanguageChangeUrl(language)}>
                  {LANGUAGE_INFO[language].labelWithoutAccent}
                </a>
              </React.Fragment>
            )
          )
        }
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
      </Container>
    </FooterContainer>
  )
}

const FooterContainer = styled.footer`
  padding-top: 20px;
  padding-bottom: 20px;
`

export default Footer
