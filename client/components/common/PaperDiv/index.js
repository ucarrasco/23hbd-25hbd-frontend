import React from 'react'
import * as styles from './index.module.scss'
import cn from 'classnames'

function PaperDiv({ backgroundColor, className, style, children, ...props }) {
  return (
    <div className={cn(styles.contentMain, className)} style={{ "--paper-effect-background-color": backgroundColor, ...style}} {...props}>
      <div className={styles.contentBox}>
        {children}
      </div>
    </div>
  )
}

export default PaperDiv
