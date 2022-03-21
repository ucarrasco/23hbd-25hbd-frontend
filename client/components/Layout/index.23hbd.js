import React, { useState, useMemo, useEffect } from 'react'
import { Container } from 'reactstrap'
import Header from './Header'
import Footer from './Footer.hbd'
import cn from 'classnames'

function Layout({ children }) {
  return (
    <React.Fragment>
      <div className="bg-sablier" />
      <Header />
      <Container className="hbd-content-container main-main">
        {children}
      </Container>
      <div className="bg-sheet"><div /></div>
      <div className="bg-dice"><div /></div>
      <Footer />
    </React.Fragment>
  )
}

export default Layout
