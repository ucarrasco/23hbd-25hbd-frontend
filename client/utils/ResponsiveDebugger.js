import React from 'react'
import { gridBreakpoints } from 'config/sassVariables'
import { useMediaQuery } from 'react-responsive'

function ResponsiveDebugger() {
  let currentBreakpoint = "xs"
  for (let breakpoint in gridBreakpoints) {
    if (useMediaQuery({ query: `(min-width: ${gridBreakpoints[breakpoint]}px)` }))
      currentBreakpoint = breakpoint
  }
  return (
    <div style={{
      position: "fixed",
      bottom: 0,
      right: 0,
      zIndex: 1000,
      padding: "5px 20px",
      backgroundColor: "black",
      color: "white",
      fontSize: 20 }}
    >
      {currentBreakpoint}
      </div>
    )
}

export default ResponsiveDebugger
