import { useContext } from 'react'
import { __RouterContext as RouterContext, matchPath } from 'react-router'

export default function useRouter(options) {
  const {
    history,
    location,
  } = useContext(RouterContext)

  if (typeof options === 'string')
    options = { path: options }

  const navigate = (to, { replace = false } = {}) => {
    if (replace)
      history.replace(to)
    else
      history.push(to)
  }

  return {
    history,
    location,
    match: options ? matchPath(location.pathname, options) : null,
    navigate
  }
}
