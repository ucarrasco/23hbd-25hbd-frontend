import React, { useRef, useEffect } from 'react'
import Achievement from 'components/Achievement'
import CommentIcon from 'utils/CommentIcon'
import ReactionIcon from '-!react-svg-loader!assets/images/reaction.svg'
import styled from 'styled-components'
import useRouter from 'utils/useRouter'

function Toolbar({
  participation,
  onInfoClick,
  onAuthorClick,
  standalone,
}) {
  const { history } = useRouter()
  const authorInfoRef = useClickTapListenerRef(
    () => { onAuthorClick() }
  )
  const commentsRef = useClickTapListenerRef(
    () => { onInfoClick() }
  )

  return (
    <ToolbarContainer
      className="d-flex align-items-center px-1"
      style={{ height: 60 }}
      standalone={standalone}
    >

      <div className="flex-grow-1" ref={authorInfoRef}>
        <div className="d-flex align-items-center">
          <div>
            <div style={{ padding: "0 10px", color: "white", fontSize: 18, whiteSpace: "nowrap" }}>
              {
                (participation.edition.useTitles && participation.title)
                  ? participation.title
                  : (participation.specificUsername || participation.user.username)
              }
              <Achievement yFix className="ml-2">{participation.achievement}</Achievement>
            </div>
            <div className="d-flex" style={{
                color: "#aaa",
                marginTop: 2,
                padding: "0 10px",
              }}
            >
              {(participation.edition.useTitles && participation.title) && (
                <div>
                  {t(`global.by-author`, { author: participation.specificUsername || participation.user.username })}
                  {
                    !standalone && (
                      <span className="mx-1">
                        •
                      </span>
                    )
                  }
                </div>
              )}
              <div className="pswp__counter" style={{
                position: "static",
                height: "initial",
                lineHeight: "initial",
                padding: 0,
              }} />
            </div>
          </div>
        </div>
      </div>

      <div className="pswp__preloader">
        <div className="pswp__preloader__icn">
          <div className="pswp__preloader__cut">
            <div className="pswp__preloader__donut" />
          </div>
        </div>
      </div>

      <span ref={commentsRef} style={{ height: 44, padding: "0 18px" }} className="d-flex align-items-center">
        {
          participation.allowReactions && (
            <ItemWithCounter count={participation.reactions.length}>
              <ReactionIcon width={18} height={18} fill="#b6b6b6" />
            </ItemWithCounter>
          )
        }
        <ItemWithCounter count={participation.comments.length} className="ml-2">
          <CommentIcon style={{ width: 16, fill: "#b6b6b6", marginTop: 6 }} />
        </ItemWithCounter>
      </span>
      <button className="pswp__button pswp__button--zoom" title="Zoom in/out" />
      <button
        className="pswp__button pswp__button--fs"
        title="Toggle fullscreen"
      />
      <button
        className="pswp__button pswp__button--share"
        title="Share"
      />
      <button
        className="pswp__button pswp__button--close"
        title="Close (Esc)"
        onClick={standalone ? () => { history.goBack() } : undefined}
      />

    </ToolbarContainer>
  )
}

function useClickTapListenerRef(baseListener) {
  const ref = useRef()
  const listener = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setTimeout( // for some reason there is a "blink" on mobile without setTimeout, dirty fix but hey, aint nobody got time for that
      () => {
        baseListener()
      }, 50
    )
  }
  useEffect(
    () => {
      if (ref.current) {
        ref.current.addEventListener('pswpTap', listener)
        ref.current.addEventListener('click', listener)
        return () => {
          ref.current.removeEventListener('pswpTap', listener)
          ref.current.removeEventListener('click', listener)
        }
      }
    },
    [ref.current]
  )
  return ref
}

function ItemWithCounter({ children, count }) {
  return (
    <ItemWithCounterContainer>
      {children}
      <Counter>{count || ""}</Counter>
    </ItemWithCounterContainer>
  )
}

const Counter = styled.span`
  color: #b6b6b6;
  display: inline-block;
  font-size: 11px;
  transform: translate(4px, 2px);
`

const ItemWithCounterContainer = styled.span`
  display: inline-block;
  & + & {
    margin-left: 25px;
  }
`

const ToolbarContainer = styled.div`
  color: #aaa;
  ${({ standalone }) => standalone ? `
    width: 100%;
    flex-shrink: 0;
    .pswp__button--share {
      display: none;
    }
  ` : undefined}
`

export default Toolbar
