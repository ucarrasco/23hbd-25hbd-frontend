import React from 'react'
import { Link } from 'react-router-dom'
import MediaQuery from 'react-responsive'
import { UncontrolledDropdown, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'
import { gridBreakpoints } from 'config/sassVariables'
import compact from 'lodash/compact'
import cn from 'classnames'

const ResponsiveMenu = ({ children }) => (
  <MediaQuery minWidth={gridBreakpoints.lg}>
    {
      lg => {
        const Container = lg ? LargeMenu : SmallMenu
        return (
          <Container>
            { children |> compact }
          </Container>
        )
      }
    }
  </MediaQuery>
)

const LargeMenu = ({ children }) => (
  <ul id="main-menu" key="menu-large" className="list-inline">
    {
      React.Children.map(
        children,
        child => (
          <li className={cn("list-inline-item", { active: child.props.active })} key={child.key}>{child}</li>
        )
      )
    }
  </ul>
)

const toggle = (
  process.env.FLAVOR === '23hbd'
    ? (
      <DropdownToggle caret color="collapsed-menu-toggle" className="btn-link">
        Menu
      </DropdownToggle>
    )
    : (
      <DropdownToggle tag="span" className="hbd-menu-item">
        Menu
      </DropdownToggle>
    )
)

const SmallMenu = ({ children }) => (
  <div id="main-menu" key="menu-collapsed" className="d-flex align-items-center">
    <UncontrolledDropdown>
      {toggle}
      <DropdownMenu>
        {
          React.Children.map(
            children,
            child => (
              <DropdownItem key={child.key} className={child.props.active ? 'active' : undefined}>{child}</DropdownItem>
            )
          )
        }
      </DropdownMenu>
    </UncontrolledDropdown>
  </div>
)

export const Item = ({
  children,
  url,
  route,
  active,
  className,
  ...otherProps
}) => (
  route ?
    <Link to={route} className={cn(className, "link-unstyled")} {...otherProps}><div>{children}</div></Link>
      : <a href={url} className={cn(className, "link-unstyled")} {...otherProps}><div>{children}</div></a>
)

ResponsiveMenu.Item = Item

export default ResponsiveMenu
