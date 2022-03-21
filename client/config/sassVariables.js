import fromPairs from 'lodash/fp/fromPairs'
import {
  gridBreakpointsStr,
  primary,
  toastColor,
  toastProgressColor,
  toastErrorColor,
  toastErrorProgressColor,
  toastWarningColor,
} from 'styles/_variables.scss'

const gridBreakpoints = gridBreakpointsStr.split(" separator ").map(
  breakpointDataStr => {
    const [breakpoint, sizeStr] = breakpointDataStr.split(" ")
    return [breakpoint, parseInt(sizeStr.replace("px", ""))]
  }
) |> fromPairs

export {
  gridBreakpoints,
  primary,
  toastColor,
  toastProgressColor,
  toastErrorColor,
  toastErrorProgressColor,
  toastWarningColor,
}
