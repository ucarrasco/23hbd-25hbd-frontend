import React from 'react'

export default str => {
  if (typeof str !== 'string') return str
  return str.split("\n").map(
    (line, i, lines) => (
      (i === lines.length - 1)
        ? line
        : (
          <React.Fragment key={i}>
            {line}
            <br/>
          </React.Fragment>
        )
    )
  )
}
