import React from 'react'
import Timer from '../Timer'
import { withCurrentEditionId } from 'utils/enhancers'
import Menu from '../Menu'
import { Container } from 'reactstrap'
import styled from 'styled-components'
import { gridBreakpoints } from 'config/sassVariables'
import useBreakpoint from 'utils/useBreakpoint'
import useRouter from 'utils/useRouter'

import FacebookIcon from '-!react-svg-loader!assets/images/facebook.svg'
import TwitterIcon from '-!react-svg-loader!assets/images/twitter.svg'
import DiscordIcon from '-!react-svg-loader!assets/images/discord.svg'
import InstagramIcon from '-!react-svg-loader!assets/images/instagram.svg'
import logoTitre from 'assets/images/23hbd/logotitre.png'

function FacebookItem() {
  return (
    <SocialIconContainer className="align-items-end">
      <div style={{ width: "0%" }} />
      <FacebookIcon height="55%" style={{ transform: "translate(0px, -35%)" }} />
    </SocialIconContainer>
  )
}

function TwitterItem() {
  return (
    <SocialIconContainer>
      <TwitterIcon height="50%" />
    </SocialIconContainer>
  )
}

function DiscordItem() {
  return (
    <SocialIconContainer>
      <DiscordIcon height="60%" />
    </SocialIconContainer>
  )
}

function InstagramItem() {
  return (
    <SocialIconContainer>
      <InstagramIcon height="55%" />
    </SocialIconContainer>
  )
}

const SocialLink = styled.a`
  & + & {
    margin-left: 5px;
  }
`

const SocialIconContainer = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--social-button-bg-color);
  color: white;
  border-radius: 50%;
  height: var(--social-button-size);
  width: var(--social-button-size);
  @media screen and (min-width: ${gridBreakpoints.sm}px) {
    padding: 2px;
  }
`

const Header = ({ editionId, ...props }) => {
  const isSm = useBreakpoint("sm")
  const { navigate } = useRouter()
  return (
    <header {...props}>
      <Container id="layout-header" className="d-flex flex-column align-items-center justify-content-center header-spacing">
        <img id="logo" src={logoTitre} alt={t(`flavored:global.event-name.long`)} />
        { editionId && <Timer /> }
        <SocialLinks id="social-links">
          <SocialLink href="https://www.facebook.com/23heuresdelaBD/" target="blank">
            <span className="sr-only">{t(`layout.social-links.facebook`, `Notre page Facebook`)}</span>
            <FacebookItem />
          </SocialLink>
          <SocialLink href="https://twitter.com/23HBD" target="blank">
            <span className="sr-only">{t(`layout.social-links.twitter`, `Notre compte Twitter`)}</span>
            <TwitterItem />
          </SocialLink>
          <SocialLink href="https://discord.gg/c6BwhC8" target="blank">
            <span className="sr-only">{t(`layout.social-links.discord`, `Notre serveur Discord`)}</span>
            <DiscordItem />
          </SocialLink>
          <SocialLink href="https://www.instagram.com/23hbd_25hbd/" target="blank">
            <span className="sr-only">{t(`layout.social-links.instagram`, `Notre compte Instagram`)}</span>
            <InstagramItem />
          </SocialLink>
        </SocialLinks>
      </Container>

      <Menu />

    </header>
  )
}

const SocialLinks = styled.div`
  display: flex;
  > a {
    transition: transform 0.2s ease-in-out;
    &:hover {
      &:nth-child(2n) {
        transform: rotate(10deg);
      }
      &:nth-child(2n+1) {
        transform: rotate(-10deg);
      }
    }
  }
  body.mobile-reader-mode & {
    opacity: 0;
  }
`

const Logo = styled.img.attrs(() => ({ src: logoImage, alt: "" }))`
  display: block;
  height: 124px;
  margin-top: 15px;
  margin-left: 45px;
  @media screen and (min-width: ${gridBreakpoints.sm}px) {
    height: 164px;
    margin-top: 0;
    margin-left: 0;
  }
`

export default withCurrentEditionId(Header)
