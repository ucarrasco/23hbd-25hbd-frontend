import React from 'react'
import { StickyContainer, Sticky } from 'react-sticky'
import EditionLinks from './EditionLinks'
import InfoBar from './InfoBar'
import { gridBreakpoints } from 'config/sassVariables'
import MediaQuery from 'react-responsive'
import cn from 'classnames'
import useBreakpoint from 'utils/useBreakpoint'
import { useMediaQuery } from 'react-responsive'

const Layout = ({ editions, children }) => {
  const md = useBreakpoint("md")
  const lg = useBreakpoint("lg")
  const isExactlyMd = md && !lg
  const lgHeight = useMediaQuery({ query: `(min-height: ${gridBreakpoints.lg}px)` })
  const activeSticky = !(isExactlyMd && !lgHeight)
  return (
    <StickyContainer>
      <div className="hbd-autbar">
        <MaybeSticky active={activeSticky}>
          {
            ({ style, isSticky }) => (
              <div className={cn("hbd-autbar__sticky-content  px-4", { "is-sticky": isSticky })} style={{...style, zIndex: "2"}}>
                <MediaQuery minWidth={gridBreakpoints.md}>
                  <InfoBar />
                </MediaQuery>
                <EditionLinks editions={editions} />
              </div>
            )
          }
        </MaybeSticky>
      </div>

      <main className="mt-4">
        {children}
      </main>
    </StickyContainer>
  )
}

function MaybeSticky({ active, children }) {
  return (
    active
      ? <Sticky>{children}</Sticky>
      : children({ style: {}, isSticky: false })
  )
}

export default Layout
