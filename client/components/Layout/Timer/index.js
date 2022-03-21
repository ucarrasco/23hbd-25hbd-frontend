import React, { useContext } from 'react'
import moment from 'moment'
import { withCurrentEditionId } from 'utils/enhancers'
import withQueryResult from 'utils/withQueryResult'
import gql from 'graphql-tag'
import TeaserContext from '../../TeaserContainer/TeaserContext'
import { Link } from 'react-router-dom'
import cn from 'classnames'
import './timer.hbd.scss'

class Timer extends React.Component {

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
    let { beginDate, endDate, isIncomingEdition, ...props } = this.props
    beginDate = moment(beginDate)
    endDate = moment(endDate)

    let now = this.state.time

    let timeInfo = {}

    switch(true) {
      case now.isBefore(beginDate):
        timeInfo = {
          caption: (
            isIncomingEdition
              ? t(`layout.timer.next-edition-in`)
              : t(`layout.timer.begins-in`)
          ),
          earlierDate: now,
          laterDate: beginDate
        }
        break
      case now.isAfter(beginDate) && now.isBefore(endDate):
        timeInfo = {
          caption: t(`layout.timer.ends-in`, `C'est fini dans :`),
          earlierDate: now,
          laterDate: endDate
        }
        break
      case now.isAfter(endDate):
        timeInfo = {
          caption: t(`layout.timer.ended-since`, `C'est fini depuis :`),
          earlierDate: endDate,
          laterDate: now
        }
        break
      default:
        throw new Error("Impossiburu!!")
    }

    let diff = timeInfo.laterDate.diff(timeInfo.earlierDate, "seconds")

    let values = [];

    [60*60*24, 60*60, 60, 1].reduce(
      (remainingDiff, unitInSec) => {
        let value = Math.floor(remainingDiff / unitInSec)
        values.push(value)
        return remainingDiff - value * unitInSec
      },
      diff
    )

    if (values[0] < 2) {
      values[1] += values[0] * 24
      values[0] = 0
    }

    values = values.map(
      value => value.toString().length < 2 ? `0${value}` : value.toString()
    )

    let strValues = [
      'days',
      'hours',
      'minutes',
      'seconds',
    ].map(
      (unit, i) => {
        return t(`layout.timer.${unit}`, { units: values[i] })
      }
    )
    if (values[0] == "00")
      strValues = strValues.slice(1)

    let textContent = strValues.join(" ")
    // textContent = "300j 00h 00m 00s"

    return (
      <TimerPresentationnal
        caption={timeInfo.caption}
        textContent={textContent}
        {...props}
      />
    )
  }
}

function TimerPresentationnal({ className, caption, textContent, ...props }) {
  return (
    <div className={cn("timer", className)} {...props}>
      <MaybeTeaserLink className="timer--block rounded">
        <div className="timer--caption">{caption}</div>
        <div
          className="timer--counter"
          dangerouslySetInnerHTML={{
            __html: textContent.replace(/[0-9]+/g, "<strong>$&</strong>")
          }}
        />
      </MaybeTeaserLink>
    </div>
  )
}

function MaybeTeaserLink(props) {
  const teaserContextValue = useContext(TeaserContext)
  if (!teaserContextValue)
    return (
      <div {...props} />
    )
  return (
    <Link {...props} to="/timer/" className={cn(props.className, "link-unstyled")} />
  )
}

const withTimerEditionDates = withQueryResult(
  gql`
    query TimerEditionDates {
      currentEdition {
        id
        beginDate
        endDate
      }
      incomingEdition {
        id
        beginDate
        endDate
        status {
          timerEnabled
        }
      }
    }
  `,
  {
    props: ({ currentEdition, incomingEdition }) => {
      const edition = (incomingEdition && incomingEdition.status.timerEnabled) ? incomingEdition : currentEdition
      return {
        beginDate: edition.beginDate,
        endDate: edition.endDate,
        isIncomingEdition: edition === incomingEdition,
      }
    },
    apollo: { fetchPolicy: 'cache-only' },
  }
)

export default withTimerEditionDates(Timer)