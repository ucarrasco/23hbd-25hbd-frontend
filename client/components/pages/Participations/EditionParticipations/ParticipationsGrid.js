import React, { useCallback, useContext } from 'react'
import { Link } from 'react-router-dom'
import cn from 'classnames'
import Achievement from 'components/Achievement'
import {
  Card as BaseCard,
  CardImg,
  CardBody,
  CardTitle,
  CardSubtitle
} from 'reactstrap'
import styled from 'styled-components'
import planchePlaceHolder from 'assets/images/planche-placeholder.png'
import LazyLoad from 'react-lazyload'
import { gridBreakpoints } from 'config/sassVariables'
import CheckedIcon from '-!react-svg-loader!assets/images/checked.svg'
import { ItemsContext } from '.'
import { SearchResultsFromOtherEditionsContext } from './SearchInOtherEditions'


export default function ParticipationsGrid({ children }) {
  return (
    <div className="participations-grid">
      {children}
    </div>
  )
}


ParticipationsGrid.Item = React.memo(({
  participation: {
    id,
    title,
    user: {
      id: userId,
      username,
      webcamUrl,
      slug
    },
    specificUsername,
    pagesDone,
    pagesGoal,
    achievement,
    edition,
    firstPage
  },
  className,
  style,
  readCompletion,
  showReadStatuses,
}) => {
  const {
    shouldShowWebcam,
    useTitles,
    quickOpenRef,
    focusUser,
    editFollowed,
    emptyIsMainstream,
  } = useContext(ItemsContext)
  const fromOtherEdition = !!useContext(SearchResultsFromOtherEditionsContext)
  const onMouseEnter = useCallback(e => { focusUser(userId) }, [focusUser])
  return (
    <Card
      tag={Link}
      to={`/participants/${edition.year}/${slug}/`}
      className={cn("m-2 link-unstyled bg-white", className)}
      onMouseEnter={onMouseEnter}
    >
      <ImgContainer
        h={120}
        onClick={
          (pagesDone !== 0 && typeof quickOpenRef.current === 'function')
            ? (e => {
              e.preventDefault()
              e.stopPropagation()
              quickOpenRef.current(slug)
            })
            : undefined
        }
      >
        {
          showReadStatuses && (readCompletion === 'read') && (
            <div style={{
              width: "100%",
              height: 120,
              position: "absolute",
              backgroundColor: "#00000073",
              color: "white",
              fontSize: 20,
            }} className="d-flex align-items-center justify-content-center">
              <CheckedIcon style={{ width: 40, height: 40 }} />
            </div>
          )
        }
        <LazyLoad
          height={120}
          offset={120}
          once
        >
          <CardImg
            top
            width="100%"
            src={pagesDone ? firstPage.thumbnail.url : planchePlaceHolder}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover"
            }}
          />
        </LazyLoad>
      </ImgContainer>
      <CardBody className="px-2 py-1 border-top d-flex">
        <div className="flex-grow-1 d-flex flex-column">
          <MainTitle className={cn(
            "mb-2 flex-grow-1",
            {
              'read-status': showReadStatuses,
              'empty-is-mainstream': emptyIsMainstream,
            },
            showReadStatuses && readCompletion
          )}>
            {
              (useTitles && title)
                ? title
                : (specificUsername || username)
            }
          </MainTitle>
          <CardSubtitle className="text-muted d-flex align-items-center" style={{ fontSize: "0.8em" }}>
            {
              useTitles && (
                <div className="flex-grow-1 mr-2" style={{ wordBreak: "break-word" }}>
                  {title && t(`global.by-author`, { author: specificUsername || username })}
                  {
                    fromOtherEdition && <span className="ml-1">{` (${edition.year})`}</span>
                  }
                </div>
              )
            }
            <div className="flex-shrink-0">
              {pagesDone}/{pagesGoal}
              {
                useTitles && (
                  <Achievement yFix className="ml-1">{achievement}</Achievement>
                )
              }
            </div>
          </CardSubtitle>
        </div>
        {
          !useTitles && (
            <Achievement yFix className="ml-1 align-self-center">{achievement}</Achievement>
          )
        }
      </CardBody>
    </Card>
  )
})

const MainTitle = styled(CardTitle)`
  line-height: 1.2em;
  word-break: break-word;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;  
  overflow: hidden;
`

const ImgContainer = styled.div`
  background-color: #d9d9d9;
  width: 100%;
  height: ${({h}) => h}px;
`

const Card = styled(BaseCard)`
  box-shadow: rgba(0,0,0,0.15) 0px 3px 2px;
  border: solid 1px transparent;
  &:hover {
    border-color: rgba(0,0,0,0.3);
  }
  transition: border-color 0.1s ease-in-out;
  margin: 8px;
  /* border of card = 1px */
`

