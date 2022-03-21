import { gridBreakpoints } from 'config/sassVariables'
import { useMediaQuery } from 'react-responsive'

function useBreakpoint(breakpoint) {
  return useMediaQuery({ query: `(min-width: ${gridBreakpoints[breakpoint]}px)` })
}

export default useBreakpoint
