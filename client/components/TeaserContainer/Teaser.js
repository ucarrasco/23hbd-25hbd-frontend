import React, { useRef, useEffect, useContext, useState, createContext, useCallback } from 'react'
import styled from 'styled-components'
import moment from 'moment'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'
import TeaserContext from './TeaserContext'
import './teaser.scss'

import AudioOn from '-!react-svg-loader!assets/images/audio-on.svg'
import AudioOff from '-!react-svg-loader!assets/images/audio-off.svg'
import maybeAudio from './maybeAudio.hbd'
import Logo from './Logo.hbd'
import Timer from './Timer'

const Teaser = () => {
  const { data: { currentEdition, teasedEdition } } = useQuery(
    gql`
      query CurrentEditionYear {
        currentEdition {
          id
          year
          beginDate
          endDate
        }
        teasedEdition: incomingEdition {
          id
          year
          beginDate
          endDate
        }
      }
    `,
    { fetchPolicy: 'cache-only' }
  )

  const { onClose, isReshow, redirectTo } = useContext(TeaserContext)

  return (
    <TeaserContainer className="teaser-container">
      {process.env.FLAVOR === '25hbd' && (
        <div className="stars-effect">
          <div className="stars" />
          <div className="stars2" />
          <div className="stars3" />
        </div>
      )}
      <AudioTeaserProvider>
        <div className="mt-5" />
        <div>
          <Logo />
          <div className="timer-container">
            <Timer beginDate={moment(teasedEdition.beginDate)} />
          </div>
          <AudioControls />
        </div>
        <div className="mb-5">
          <a
            href={isReshow ? "" : redirectTo}
            onClick={e => { e.preventDefault(); onClose() }}
            className="link-unstyled"
          >
            <span className="teaser-footer" style={{ opacity: isReshow ? 0.6 : 1 }}>
              {isReshow ? `Fermer` : `Accès au site ${currentEdition.year} →`}
            </span>
          </a>
        </div>
      </AudioTeaserProvider>
    </TeaserContainer>
  )
}

function AudioControls() {
  const ctx = useContext(AudioTeaserContext)
  if (!ctx) return null
  const {
    audioNode,
    audioOn,
    playing,
  } = ctx
  return (
    <div>
      <AudioButton active={audioOn && playing} onClick={() => { if (audioNode.paused) audioNode.play(); audioNode.muted = false }}>
        <AudioOn />
      </AudioButton>
      <AudioButton active={!audioOn || !playing} onClick={() => { audioNode.muted = true }}>
        <AudioOff />
      </AudioButton>
    </div>
  )
}

const AudioTeaserContext = createContext()

function AudioTeaserProvider({ children }) {
  const [audioNode, setAudioNode] = useState(null)
  const [audioOn, setAudioOn] = useState(false)
  const [playing, setPlaying] = useState(false)
  const { isReshow } = useContext(TeaserContext)

  const onRefChange = useCallback(node => {
    setAudioNode(node)
    if (node !== null) {
      setAudioOn(!node.muted)
      setPlaying(!node.paused)
    }
  }, [])

  if (!maybeAudio) return children

  return (
    <AudioTeaserContext.Provider value={{ audioNode, audioOn, playing }}>
      <audio
        loop
        ref={onRefChange}
        autoPlay={!isReshow}
        // muted
        onVolumeChange={
          e => {
            setAudioOn(!e.target.muted)
          }
        }
        onPlay={() => { setPlaying(true) }}
        onPause={() => { setPlaying(false) }}
      >
        <source src={maybeAudio} type="audio/mpeg" />
      </audio>
      {!!audioNode && children}
    </AudioTeaserContext.Provider>
  )
}


const AudioButton = styled.span`
  font-size: 3rem;
  display: inline-block;
  cursor: pointer;
  & + & {
    margin-left: 0.5em;
  }
  > svg { height: 1em; }
  opacity: ${({ active }) => active ? 1 : 0.3};
`

const TeaserContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: center;
  flex-direction: column;
`

export default Teaser

