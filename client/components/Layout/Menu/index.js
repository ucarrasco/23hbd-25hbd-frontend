import React from 'react'
import { Container } from 'reactstrap'
import MainMenu from './MainMenu'
import RightMenu from './RightMenu.hbd'

const Menu = () => (
  <Container tag="nav" id="main-nav" className="d-flex justify-content-between">
    <MainMenu />
    <RightMenu />
  </Container>
)

export default Menu
