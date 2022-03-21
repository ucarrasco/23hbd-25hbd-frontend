import React, { useEffect, useRef, useCallback } from 'react'
import styled from 'styled-components'
import BodyChildPortal from 'utils/BodyChildPortal'
import useReadStatuses from 'utils/useReadStatuses'
import useMobileReaderMode from 'utils/useMobileReaderMode'

export default function WebtoonReader({ participation, toolbar, onClose, setCurrentPage }) {
  const mobileReaderMode = useMobileReaderMode()
  const { readPage } = useReadStatuses()
  useEffect(
    () => {
      document.body.style.overflowY = "hidden"
      return () => { document.body.style.overflowY = "" }
    },
    []
  )
  const scrollContainerRef = useRef()
  const pageNodes = useRef({})
  const pagesVisibility = useRef({})
  const pageUrlTimeout = useRef()
  const pageUrlCallback = useRef()

  const checkVisiblePages = useCallback(() => {
    for (const pageNumberStr in pageNodes.current) {
      const pageNumber = parseInt(pageNumberStr)
      const wasVisible = pagesVisibility.current[pageNumber]
      const isVisible = nodeIsVisible(pageNodes.current[pageNumber])
      pagesVisibility.current[pageNumber] = isVisible
      if (!wasVisible && isVisible) {
        readPage(participation.id, pageNumber)
        if (!mobileReaderMode) {
          pageUrlCallback.current = () => {
            setCurrentPage(pageNumber)
          }
        }
      }
    }
    if (pageUrlTimeout.current) {
      clearTimeout(pageUrlTimeout.current)
    }
    pageUrlTimeout.current = setTimeout(
      () => {
        pageUrlTimeout.current = undefined
        if (pageUrlCallback.current) {
          pageUrlCallback.current()
          pageUrlCallback.current = undefined
        }
      },
      100
    )
  }, [])
  useEffect(
    () => {
      scrollContainerRef.current.addEventListener('scroll', checkVisiblePages)
      return () => {
        scrollContainerRef.current.removeEventListener('scroll', checkVisiblePages)
      }
    },
    []
  )
  return (
    <BodyChildPortal>
      <Backdrop onClick={onClose} ref={scrollContainerRef}>
        <div onClick={e => { e.stopPropagation() }}>
          { toolbar || <div className="pb-5" /> }
          {participation.pages.map(
            (page, i) => (
              <img
                key={page.url}
                src={page.url}
                alt={``}
                className="d-block"
                style={{ maxWidth: "100%" }}
                ref={node => {
                  if (node) {
                    pageNodes.current[i+1] = node
                    checkVisiblePages()
                  }
                }}
              />
            )
          )}
          <div
            className="py-3 py-lg-5 text-muted text-center"
            style={{ cursor: "pointer" }}
            onClick={e => {
              e.preventDefault()
              scrollContainerRef.current.scrollTop = 0
            }}
          >
            ↑ Retour en haut ↑
          </div>
        </div>
      </Backdrop>
    </BodyChildPortal>
  )
}

function nodeIsVisible(node) {
  const { top } = node.getBoundingClientRect()
  return (top >= 0 && top < (window.innerHeight / 2))
}

const Backdrop = styled.div`
  position: fixed;
  height: 100%;
  width: 100%;
  top: 0px;
  left: 0px;
  z-index: 1000;
  overflow-y: auto;
  display: flex;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.9);
  @media(min-width: 800px) {
    background-color: rgba(0, 0, 0, 0.8);
  }
`
