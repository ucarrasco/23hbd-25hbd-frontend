import React from 'react'
import Markdown from 'utils/Markdown'

export default () => (
  <React.Fragment>
    <h1 className="mb-5">
      {t(`flavored:contact-page.title`)}
    </h1>

    <Markdown className="mb-4">
      {t(`flavored:contact-page.content`)}
    </Markdown>
  </React.Fragment>
)

