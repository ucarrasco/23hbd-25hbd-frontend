import React from 'react'
import mdToHtml from 'common/mdToHtml'

function Markdown({ tag: Component = 'div', children, ...props }) {
  return (
    <Component
      {...props}
      dangerouslySetInnerHTML={{ __html: mdToHtml(children) }}
    />
  )
}

export default Markdown
