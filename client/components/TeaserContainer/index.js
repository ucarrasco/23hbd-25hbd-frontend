import React, { useState, useEffect } from 'react'
import Teaser from './Teaser'
import TeaserContext from './TeaserContext'
import { Redirect } from 'react-router'
import qs from 'query-string'
import useRouter from 'utils/useRouter'

const MaybeTeaserContainer = (props) => (
  props.teasedEdition ? <TeaserContainer {...props} /> : props.children
)

const TeaserContainer = ({ children, teasedEdition }) => {
  const flagKey = `hasSeenTeaser-${teasedEdition.id}`
  const [hasSeenTeaser, setHasSeenTeaser] = useState(!!localStorage.getItem(flagKey))
  useEffect(
    () => {
      localStorage.setItem(flagKey, hasSeenTeaser)
    },
    [hasSeenTeaser]
  )
  const { match, location, history } = useRouter("/timer/")
  const [isReshow, setIsReshow] = useState(!match && hasSeenTeaser)
  useEffect(
    () => {
      if (!match && hasSeenTeaser)
        setIsReshow(true)
    },
    [!!match]
  )

  if (!hasSeenTeaser && !match) {
    const redirectionUrl = `${location.pathname}${location.search}${location.hash}`
    return <Redirect to={`/timer/${(redirectionUrl && redirectionUrl != "/") ? `?redirect=${encodeURIComponent(redirectionUrl)}` : ""}`} />
  }

  const urlToRedirectTo = qs.parse(location.search).redirect || "/"

  return (
    <TeaserContext.Provider
      value={{
        showing: !!match,
        isReshow,
        redirectTo: urlToRedirectTo,
        onClose: () => {
          setHasSeenTeaser(true)
          if (isReshow)
            history.goBack()
          else
            history.replace(urlToRedirectTo)
        }
      }}
    >
      {
        match
          ? <Teaser />
          : children
      }
    </TeaserContext.Provider>
  )
}

export default MaybeTeaserContainer
