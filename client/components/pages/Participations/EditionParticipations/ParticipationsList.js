import React, { useCallback, useContext } from 'react'
import webcamImage from 'assets/images/cam.svg'
import { Link } from 'react-router-dom'
import cn from 'classnames'
import Achievement from 'components/Achievement'
import Checkbox from 'components/Checkbox'
import client from 'config/apolloClient'
import gql from 'graphql-tag'
import { ItemsContext } from '.'
import { SearchResultsFromOtherEditionsContext } from './SearchInOtherEditions'
import useBreakpoint from 'utils/useBreakpoint'

export default function ParticipationsList({ children, className, bordered }) {
  const sm = useBreakpoint("sm")
  const lg = useBreakpoint("lg")
  const numberOfColumns = lg ? 3 : (sm ? 2 : 1)
  const colSize = Math.ceil(children.length / numberOfColumns)
  const columns = []
  for (let col = 0; col < numberOfColumns; col++) {
    columns.push(
      children.slice(
        col * colSize,
        (col + 1) * colSize,
      )
    )
  }
  return (
    <div className={cn(className, "columns-layout d-flex", { bordered })}>
      {
        columns.map(
          (colChildren, colIndex) => (
            <div key={colIndex} className="columns-layout-col">
              {colChildren}
            </div>
          )
        )
      }
    </div>
  )
}

ParticipationsList.Item = React.memo(({
  participation: { id, user: { id: userId, username, webcamUrl, slug }, specificUsername, pagesDone, pagesGoal, achievement, edition },
  className,
  readCompletion,
  followed,
  setFollowed,
  showReadStatuses,
}) => {
  const {
    shouldShowWebcam,
    useTitles,
    quickOpen,
    focusUser,
    editFollowed,
    emptyIsMainstream,
  } = useContext(ItemsContext)
  const fromOtherEdition = !!useContext(SearchResultsFromOtherEditionsContext)
  const onMouseEnter = useCallback(e => { focusUser(userId) }, [focusUser])
  return (
    <div className={cn(
      "hbd-participant",
      className,
      {
        'read-status': showReadStatuses && !editFollowed,
        'empty-is-mainstream': emptyIsMainstream,
      },
      showReadStatuses && !editFollowed && readCompletion,
    )}>

      {
        editFollowed && (
          <Checkbox
            checked={followed}
            onClick={() => { setFollowed(!followed) }}
            className="mr-1"
          />
        )
      }

      <Link
        className="hbd-participant__pseudo link-unstyled"
        to={`/participants/${edition.year}/${slug}/`}
        onMouseEnter={onMouseEnter}
        onClick={editFollowed ? (e => { e.preventDefault(); setFollowed(!followed) }) : undefined}
      >
        {specificUsername || username}
        {
          fromOtherEdition && <span style={{ fontSize: "0.8em" }} className="text-muted  ">{` (${edition.year})`}</span>
        }
      </Link>

      { webcamUrl && shouldShowWebcam ?
        <a className="ml-2 d-inline-flex" href={webcamUrl} target="blank">
          <img alt="webcam" height="18" width="18" src={webcamImage} />
        </a>
        : undefined
      }
      <Achievement fillSpace className="ml-2">{achievement}</Achievement>
      <span className="hbd-participant__pages">
        {pagesDone}/{pagesGoal}
      </span>
    </div>
  )
})
