import React from 'react'
import cn from 'classnames'

import silverTurtle from 'assets/images/turtles/silver.png'
import goldTurtle from 'assets/images/turtles/gold.png'
import redTurtle from 'assets/images/turtles/red.png'

const urls = {
  silver: silverTurtle,
  gold: goldTurtle,
  pink: redTurtle,
}

const Achievement = ({
  achievement,
  children,
  style,
  className,
  yFix,
  fillSpace, // nothing
  altSilver,
  ...props
}) => {
  achievement = achievement || children
  if (!achievement)
    return null
  return (
    <span
      style={{
        width: 18,
        height: 18,
        backgroundImage: `url(${urls[achievement]})`,
        backgroundRepeat: "no-repeat",
        display: "inline-block",
        ...(yFix && {
          position: "relative",
          top: 2
        }),
        ...((altSilver && achievement === 'silver') && {
          filter: "brightness(1.5)"
        }),
        ...style
      }}
      className={cn(className)}
      {...props}
    />
  )
}

export default Achievement
