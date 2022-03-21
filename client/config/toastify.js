import { toast, style as setToastStyles } from 'react-toastify'
import {
  toastColor,
  toastProgressColor,
  toastErrorColor,
  toastErrorProgressColor,
  toastWarningColor,
} from 'config/sassVariables'

setToastStyles({
  // width: "320px",
  // colorDefault: "#fff",
  // colorInfo: "#3498db",
  // colorSuccess: "#07bc0c",
  // colorWarning: "#f1c40f",
  // colorError: "#e74c3c",
  // colorProgressDefault: "linear-gradient(to right, #4cd964, #5ac8fa, #007aff, #34aadc, #5856d6, #ff2d55)",
  // mobile: "only screen and (max-width : 480px)",
  // fontFamily: "sans-serif",
  // zIndex: 9999,
  colorSuccess: toastColor,
  colorError: toastErrorColor,
  colorWarning: toastWarningColor,
})


// little hack to config default progressbar color based on toast type

const progressColors = {
  success: toastProgressColor,
  error: toastErrorProgressColor,
}

function wrap(originalFunction, color) {
  return function(content, options, ...otherAttrs) {
    let injectedOptions = {
      progressClassName: {
        background: color
      }
    }
    return originalFunction(content, { ...injectedOptions, ...options }, ...otherAttrs)
  }
}

for (let type in progressColors)
  toast[type] = wrap(toast[type], progressColors[type])



// apply this to any <ToastContainer> component

export default {
  position: toast.POSITION.BOTTOM_LEFT,
  autoClose: 5000,
  // autoClose: false,
  toastClassName: {
    borderRadius: '4px',
    minHeight: '3.5em',
    paddingTop: '4px',
    fontFamilty: 'inherit'
  },
  bodyClassName: {
    fontSize: '1rem',
    lineHeight: '1.3em',
    margin: '14px 0.5em 10px 1em'
  }
}