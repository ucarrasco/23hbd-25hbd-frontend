import React from 'react'
import Timer from '../Timer'
import { withCurrentEditionId } from 'utils/enhancers'
import Menu from '../Menu'
import styled from 'styled-components'
import FacebookIcon from '-!react-svg-loader!assets/images/facebook.svg'
import TwitterIcon from '-!react-svg-loader!assets/images/twitter.svg'
import DiscordIcon from '-!react-svg-loader!assets/images/discord.svg'
import InstagramIcon from '-!react-svg-loader!assets/images/instagram.svg'
import { gridBreakpoints } from 'config/sassVariables'
import { Link } from 'react-router-dom'

function FacebookItem() {
  return (
    <SocialIconContainer className="align-items-end">
      <div style={{ width: "20%" }} />
      <FacebookIcon height="80%" />
    </SocialIconContainer>
  )
}

function TwitterItem() {
  return (
    <SocialIconContainer>
      <TwitterIcon height="60%" />
    </SocialIconContainer>
  )
}

function DiscordItem() {
  return (
    <SocialIconContainer>
      <DiscordIcon height="70%" />
    </SocialIconContainer>
  )
}

function InstagramItem() {
  return (
    <SocialIconContainer>
      <InstagramIcon height="70%" />
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
  background-color: #3f524a;
  color: #d2d7d0;
  border-radius: 5px;
  height: 35px;
  width: 35px;
  @media screen and (min-width: ${gridBreakpoints.sm}px) {
    height: 41px;
    width: 41px;
  }
`

const Spacing = styled.div.attrs(() => ({ className: "container d-flex flex-column" }))`
  height: 290px;
  padding-bottom: 20px;
  padding-top: 20px;
`

const Header = ({ editionId }) => (
  <header className="hbd-main-header text-center">
    <div className="container">
      <Link id="hbd-logo" to="/" />
    </div>
    <Spacing style={{position: "relative"}}>
      <div className="d-flex justify-content-end" style={{position: "relative"}}>
        <SocialLink href="https://www.facebook.com/25HBD/" target="blank">
          <span className="sr-only">Notre page facebook</span>
          <FacebookItem />
        </SocialLink>
        <SocialLink href="https://twitter.com/25_hbd" target="blank">
          <span className="sr-only">Notre twitter</span>
          <TwitterItem />
        </SocialLink>
        <SocialLink href="https://discord.gg/c6BwhC8" target="blank">
          <span className="sr-only">Notre discord</span>
          <DiscordItem />
        </SocialLink>
        <SocialLink href="https://www.instagram.com/23hbd_25hbd/" target="blank">
          <span className="sr-only">Notre instagram</span>
          <InstagramItem />
        </SocialLink>
      </div>
      { editionId && <Timer /> }
    </Spacing>

    <Menu />

  </header>
)

export default withCurrentEditionId(Header)
