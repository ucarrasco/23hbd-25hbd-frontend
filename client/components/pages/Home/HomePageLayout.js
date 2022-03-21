import React from 'react'
import {
  Row,
  Col
} from 'reactstrap'
import reject from 'lodash/fp/reject'
import cn from 'classnames'

const HomePageLayout = ({ children, ...otherProps }) => {
  const FooterComponentType = (<HomePageLayout.Footer />).type
  const childrenArray = Array.isArray(children) ? children : [children]
  return (
    <div {...otherProps}>
      <Row>
        {
          childrenArray |> reject(elem => elem.type === FooterComponentType)
        }
      </Row>
      {
        childrenArray.find(elem => elem.type === FooterComponentType)
      }
    </div>
  )
}

HomePageLayout.MainContent = (props) => (
  <Col xs="12" md="8" className="py-3" {...props} />
)

HomePageLayout.LeftSide = ({ className, ...otherProps }) => (
  <aside className={cn("col-md-2  order-last  order-md-first", { 'border-right-sm-0': !!otherProps.children }, className)} {...otherProps} />
)

HomePageLayout.RightSide = ({ className, ...otherProps }) => (
  <aside className={cn("col-md-2", { 'border-left-sm-0': !!otherProps.children }, className)} {...otherProps} />
)

HomePageLayout.Footer = ({ children, className, style, ...otherProps }) => (
  <aside
    className={cn("row  my-3  py-3", className)}
    style={{
      backgroundColor: "#e7e8e9",
      borderTop: "groove 2px #fff",
      borderBottom: "groove 2px #fff",
      ...style
    }}
    {...otherProps}
  >
    { children }
  </aside>
)

export default HomePageLayout
