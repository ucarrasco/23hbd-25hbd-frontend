import React, { useMemo } from 'react'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'
import moment from 'moment'

const TwitchWidgetMaybe = ({ participation }) => {
  const twitchChannel = getTwitchChannel(participation.user.webcamUrl)
  const now = useMemo(() => moment(), [])
  const { data: { currentEdition }} = useQuery(
    gql`
      query CurrentEdition {
        currentEdition {
          id
          beginDate
          endDate
        }
      }
    `, { fetchPolicy: 'cache-only' }
  )

  const shouldShowTwitchWidget = (
    !!twitchChannel
    && participation.edition.id === currentEdition.id
    && now.isBefore(moment(currentEdition.endDate).clone().add(8, 'hours'))
  )

  if (!shouldShowTwitchWidget) return null
  return (
    <TwitchWidget channel={twitchChannel} />
  )
}

function TwitchWidget({ channel, autoplay = true, muted = true }) {
  const host = (new URL(process.env.HTTP_HOST)).hostname
  return (
    <iframe
      src={`https://player.twitch.tv/?channel=${channel}&parent=${encodeURIComponent(host)}`}
      autoPlay={autoplay}
      muted={muted}
      frameBorder="0"
      allowFullScreen={true}
      scrolling="no"
      height="378"
      width="100%"
      className="mt-5"
    />
  )
}

function getTwitchChannel(webcamUrl) {
  if (!webcamUrl) return null
  const match = webcamUrl.match(/^(https?:\/\/)?(\w+\.)?twitch\.tv\/([^/\n]+)\/?/)
  return match ? match[3] : null
}

export default TwitchWidgetMaybe
