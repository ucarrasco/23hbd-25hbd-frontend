import React, { useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'

export default function BodyChildPortal({ children }) {
  const domNode = useMemo(() => {
    const node = document.createElement('div')
    document.body.appendChild(node)
    return node
  }, [])
  useEffect(() => () => { document.body.removeChild(domNode) }, [])
  return createPortal(
    children,
    domNode
  )
}
