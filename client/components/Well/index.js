import React from 'react'
import classNames from 'classnames'
import './well.scss'

export const WellTitle = ({children}) => children
export const WellFooter = ({children}) => children

class Well extends React.Component {

  render() {
    let { title, className, children, alt, titlePosition = 'center' } = this.props
    let childrenArray = (Array.isArray(children) ? children : [children])
    let body = childrenArray.filter(children => !(children && (children.type == WellFooter || children.type == WellTitle)))
    let titleChildren = childrenArray.find(children => children && children.type == WellTitle)
    let footer = childrenArray.find(children => children && children.type == WellFooter)

    return (
      <div className={classNames(className, "hbd-well", { "hbd-well-alt": alt })}>
        <div className={`hbd-well-top hbd-well-top-title-${titlePosition}`}>
          {
            (titleChildren || title) && (
              <div className="hbd-well-ride-container">
                <div className="hbd-well-title">
                  {titleChildren || title}
                </div>
              </div>
            )
          }
        </div>
        <div className="hbd-well-transclude-content">{body}</div>
        <div className="hbd-well-ride-container">
          <div className="text-center">
            {footer}
          </div>
        </div>
      </div>
    )
  }
}

export default Well
