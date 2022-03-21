import React from 'react'
import { Query } from '@apollo/react-components'
import compose from 'utils/compose'

export default ({
  renderOnlyIfData,
  formatData,
  children,
  ...props
}) => {
  const childrenMiddlewares = []

  if (renderOnlyIfData)
    childrenMiddlewares.push(
      previousChildren =>
        res =>
          (res.loading || res.error)
            ? null
            : previousChildren(res)
    )

  if (formatData)
    childrenMiddlewares.push(
      previousChildren =>
        res =>
          (res.loading || res.error)
            ? previousChildren(res)
            : previousChildren({
              ...res,
              data: formatData(res.data)
            })
    )
  return (
    <Query {...props}>
      { compose(...childrenMiddlewares)(children) }
    </Query>
  )
}
