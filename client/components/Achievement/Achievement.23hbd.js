import React from 'react'
import cn from 'classnames'
import './achievement.23hbd.scss'

const Achievement = ({
  achievement,
  children,
  fillSpace,
  style,
  className,
  altSilver,
  yFix,
  ...props
}) => {
  achievement = achievement || children
  if (!achievement && !fillSpace)
    return null
  return (
    <svg
      height="18"
      width="18"
      className={cn(
        `achievement  achievement-${achievement || 'none'}`,
        className,
        {
          "achievement-silver-alt": achievement === 'silver' && altSilver
        }
      )}
      style={{
        ...style,
        ...(yFix && {
          position: "relative",
          top: -2
        })
      }}
      {...props}
    >
      <path d="M11.2,8.1c0.4-0.6,0.8-1.2,1.1-1.9c1.5-2.9,2.2-5.6,1.4-6C13-0.2,11.2,1.9,9.7,4.8C9.2,5.6,8.9,6.4,8.6,7.2
	C8.1,7.1,7.6,7,7,7S5.9,7.1,5.4,7.2C5.1,6.4,4.8,5.6,4.3,4.8C2.8,1.9,1-0.2,0.2,0.2c-0.7,0.4-0.1,3.1,1.4,6C2,6.9,2.4,7.5,2.8,8.1
	C1.1,9.2,0,10.8,0,12.5c0,3,3.1,5.5,7,5.5s7-2.4,7-5.5C14,10.8,12.9,9.2,11.2,8.1z"/>
    </svg>
  )
}

export default Achievement
