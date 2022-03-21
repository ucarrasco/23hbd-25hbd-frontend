import React from 'react'
import CheckedIcon from '-!react-svg-loader!assets/images/checked-fat.svg'
import cn from 'classnames'

function Checkbox({ checked, onClick, style, className }) {
  return (
    <span style={{
      width: 15,
      height: 15,
      borderRadius: 4,
      border: "solid 1px #6c757d",
      display: "inline-block",
      ...style,
    }}
    className={cn("d-flex alignt-items-center justify-content-center flex-shrink-0", className)}
    onClick={onClick}
  >
      <CheckedIcon
        style={{
          height: 13,
          width: 9,
          color: "#6c757d",
          opacity: checked ? 1 : 0,
        }}
      />
    </span>
  )
}

export default Checkbox
