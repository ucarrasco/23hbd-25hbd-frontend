import React from 'react'
import { Container } from 'reactstrap'
import Header from './Header'
import Footer from './Footer.hbd'

const Layout = ({ children }) => (
  <>
    <div className="debug-bg-elements">
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
    </div>
    <Header />
    <Container className="hbd-content-container main-main">
      {children}
    </Container>
    <Footer />
  </>
)

export default Layout
