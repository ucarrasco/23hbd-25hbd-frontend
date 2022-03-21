import React from 'react'
import HomeIcon from '-!react-svg-loader!assets/images/23hbd/ic-home.svg'

export default ({ children }) => (
  <React.Fragment>
    <HomeIcon className="d-none d-lg-inline" style={{ height: "1em" }} />
    <span className="d-lg-none">{children}</span>
  </React.Fragment>
)
