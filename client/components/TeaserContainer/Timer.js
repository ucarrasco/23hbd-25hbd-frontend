import React from 'react'
import moment from 'moment'
import i18n from 'i18next'

export default class Timer extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      timer: null,
      time: moment()
    }
  }

  componentDidMount() {
    let timer = setInterval(this.tick, 1000)
    this.setState({ timer })
  }

  componentWillUnmount() {
    clearInterval(this.state.timer)
  }

  tick = () => {
    this.state.time.add(1, "seconds")
    this.forceUpdate()
  }

  render() {
    let { beginDate } = this.props
    beginDate = moment(beginDate)
    let now = this.state.time
    let diff = beginDate.diff(now, "seconds")
    let values = []

    ;[60 * 60 * 24, 60 * 60, 60, 1].reduce(
      (remainingDiff, unitInSec) => {
        let value = Math.floor(remainingDiff / unitInSec)
        values.push(value)
        return remainingDiff - value * unitInSec
      },
      diff
    )

    values = values.map(
      value => value.toString().length < 2 ? `0${value}` : value.toString()
    )

    const timeText = (
      <>
        {values[0] !== "00" && (
          <>
            {values[0]}
            <small>{i18n.t('layout.timer.days')}{" "}</small>
          </>
        )}
        {values[1]}
        <small>{i18n.t('layout.timer.hours')}{" "}</small>
        {values[2]}
        <small>{i18n.t('layout.timer.minutes')}{" "}</small>
        {values[3]}
        <small>{i18n.t('layout.timer.seconds')}</small>
      </>
    )

    return (
      <div className="animate-fade-in-up">{timeText}</div>
    )
  }
}
