import React from 'react'
import DesktopParticipation from './Desktop'
import MobileParticipation from './Mobile'
import withParticipationIdFromRoute from './withParticipationIdFromRoute'
import useMobileReaderMode from 'utils/useMobileReaderMode'

function ResponsiveParticipation(props) {
  const mobileReaderMode = useMobileReaderMode()
  return (
    mobileReaderMode
      ? <MobileParticipation {...props} />
      : <DesktopParticipation {...props} />
  )
}

const Routed = withParticipationIdFromRoute(ResponsiveParticipation)

export { Routed }
export default ResponsiveParticipation
