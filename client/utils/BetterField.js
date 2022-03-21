import React from 'react'
import { Field } from 'redux-form'

const RenderPropsFieldInput = ({ children, ...props }) => (
  children(props)
)

const BetterField = props => (
  <Field
    {...props}
    component={
      (typeof props.children === 'function' && !props.component)
        ? RenderPropsFieldInput
        : props.component
    }
  />
)

export default BetterField
