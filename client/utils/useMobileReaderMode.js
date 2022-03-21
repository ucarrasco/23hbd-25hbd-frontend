import { gridBreakpoints } from 'config/sassVariables'
import { useMediaQuery } from 'react-responsive'

function useMobileReaderMode() {
  const touchDevice = useMediaQuery({ query: `(pointer: coarse)` })
  const smWidth = useMediaQuery({ query: `(min-width: ${gridBreakpoints.sm}px)` })
  const smHeight = useMediaQuery({ query: `(min-height: ${gridBreakpoints.sm}px)` })
  const lgWidth = useMediaQuery({ query: `(min-width: ${gridBreakpoints.lg}px)` })
  const lgHeight = useMediaQuery({ query: `(min-height: ${gridBreakpoints.lg}px)` })
  if (touchDevice)
    return !lgWidth || !lgHeight
  return !smWidth || !smHeight
}

export default useMobileReaderMode
