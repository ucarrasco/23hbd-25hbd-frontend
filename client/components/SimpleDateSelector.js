import React from 'react'
import range from 'lodash/range'
import min from 'lodash/min'
import max from 'lodash/max'
import moment from 'moment'
import { Input } from 'reactstrap'

const SimpleDateSelector = ({ value, onChange, yearsRange, invalid, ...otherProps }) => {
  const day = value.date()
  const month = value.month()
  const year = value.year()

  return (
    <div {...otherProps}>
      <Input
        type="select"
        onChange={e => { onChange(value.clone().date(e.target.value)) }}
        value={day}
        invalid={invalid}
      >
        { range(1, moment([year, month, 1]).daysInMonth() + 1).map(
            d =>
              <option key={d} value={d}>{d}</option>
          )
        }
      </Input>
      <Input
        type="select"
        onChange={
          ({ target: { value: month }}) => {
            onChange(
              value.clone().month(month).date(
                min([
                  moment([year, month, 1]).daysInMonth(),
                  day
                ])
              )
            )
          }
        }
        value={month}
        invalid={invalid}
      >
        {
          range(0, 12).map(
            (m) =>
              <option key={m} value={m}>
                {moment([0,m]).format("MMMM")}
              </option>
          )
        }
      </Input>
      <Input
        type="select"
        onChange={e => { onChange(value.clone().year(e.target.value)) }}
        value={year}
        invalid={invalid}
      >
        {
          range(max(yearsRange), min(yearsRange)).map(
            y =>
              <option key={y} value={y}>{y}</option>
          )
        }
      </Input>
    </div>
  )
}

export const FieldInput = ({ input: { value, onChange }, meta, ...otherProps }) => (
  <SimpleDateSelector
    value={value}
    onChange={onChange}
    {...otherProps}
  />
)

export default SimpleDateSelector

