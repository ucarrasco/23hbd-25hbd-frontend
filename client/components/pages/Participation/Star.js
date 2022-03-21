import React from 'react'
import styled, { css } from 'styled-components'
import StarInactive from '-!react-svg-loader!assets/images/star-inactive.svg'
import StarActive from '-!react-svg-loader!assets/images/star-active.svg'

export default function Star({ active, style, ...props }) {
  const styl = {
    height: "1em",
    width: "1em",
    cursor: "pointer",
    ...style,
  }
  if (active) {
    return (
      <StarActiveHover
        style={styl}
        {...props}
      />
    )
  }
  return (
    <StarInactiveHover
      style={styl}
      {...props}
    />
  )
}

const StarActiveHover = styled(StarActive)`
  color: rgb(255, 193, 7);
  color: rgb(255 172 189);
  color: #d2c9c9;
  color: #bbbbc1;
  color: #c7c7d6;
  ${({ onClick }) =>
    !!onClick && css`
      &:hover {
        opacity: 0.8;
      }
    `
  }
`

const StarInactiveHover = styled(StarInactive)`
  color: #00000040;
  ${({ onClick }) =>
    !!onClick && css`
      &:hover {
        color: #00000060;
      }
    `
  }
`
