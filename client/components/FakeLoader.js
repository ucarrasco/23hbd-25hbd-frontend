import React, { useState, useEffect } from 'react'
import Loader from 'components/Loader'
import cn from 'classnames'

const FakeLoader = ({ children, duration, className, style }) => {
  const [showLoader, setShowLoader] = useState(true)
  useEffect(
    () => {
      const loaderCallback = setTimeout(
        () => {
          setShowLoader(false)
        },
        duration
      )
      return () => {
        clearTimeout(loaderCallback)
      }
    }
  )
  return (
    showLoader
      ? (
        <div className={cn("d-flex justify-content-center", className)} style={style}>
          <Loader size={40} />
        </div>
      )
      : children
  )
}

export default FakeLoader
