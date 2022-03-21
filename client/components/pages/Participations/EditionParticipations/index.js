import React, { useState, useEffect, useMemo, useContext, useRef, createContext, useCallback } from 'react'
import withQueryResult from 'utils/withQueryResult'
import compose from 'utils/compose'
import {
  EditionParticipations as EDITION_PARTICIPATIONS_QUERY,
  Edition as EDITION_QUERY,
} from '../operations.gql'
import Loader from 'components/Loader'
import cn from 'classnames'
import FiltersProvider, { FiltersContext } from './FiltersProvider'
import Toolbar from './Toolbar'
import useRouter from 'utils/useRouter'
import gql from 'graphql-tag'
import FocusUserContext from '../FocusUserContext'
import useReadStatuses from 'utils/useReadStatuses'
import { useQuery } from '@apollo/react-hooks'
import isIn from 'common/fp/isIn'
import { Button, Collapse } from 'reactstrap'
import useUserPreference from 'utils/useUserPreference'
import { features } from 'common/flavorConfig.hbd'
import EditIcon from '-!react-svg-loader!assets/images/edit.svg'
import moment from 'moment'
import useMobileReaderMode from 'utils/useMobileReaderMode'
import qs from 'query-string'
import useFollow from './useFollow'
import ParticipationDesktopQuickOpen from './ParticipationDesktopQuickOpen'
import SearchInOtherEditions from './SearchInOtherEditions'
import ParticipationsList from './ParticipationsList'
import ParticipationsGrid from './ParticipationsGrid'

const EditionParticipations = ({
  edition,
  participations,
  loading,
}) => {
  const now = moment()
  const [ animated, setAnimated ] = useState(false)
  const {
    filterParticipations,
    filtersValues,
    effectiveSearch,
    setCompletion,
    setGalleryMode,
  } = useContext(FiltersContext)

  const participationsToShow = useMemo(
    () => filterParticipations(participations),
    [ participations, ...filtersValues ]
  )

  const { focusUser } = useContext(FocusUserContext)

  useEffect(
    () => {
      if (loading)
        setAnimated(true)
    }
  )

  const emptyIsMainstream = !!(
    participations
    &&
    now.isBefore(edition.endDate)
    &&
    participations.length !== 0
    && (
      (
        participations.filter(participation => participation.pagesDone === 0).length
        /
        participations.length
      ) > 0.9
    )
  )

  const [showFollowedParticipations, setShowFollowedParticipations] = useUserPreference('showFollowedParticipations')
  const followedUserIds = useFollowedUserIds()
  const [editFollowed, setEditFollowed] = useState(false)
  const [quickOpenedParticipationId, quickOpenRef] = useQuickOpen(participations)
  const shouldShowWebcam = useMemo(
    () => now.isBefore(moment(edition.endDate).add(1, "day")),
    [edition]
  )

  // change in any of these values will cause a re-render of ALL items
  const itemsCtxValue = {
    shouldShowWebcam,
    useTitles: edition.useTitles,
    quickOpenRef,
    focusUser,
    editFollowed,
    emptyIsMainstream,
  }
  const itemsCtxMemoizedValue = useMemo(
    () => {
      return itemsCtxValue
    },
    Object.values(itemsCtxValue)
  )

  const followedParticipations = useMemo(
    () => (
      participationsToShow && participationsToShow.filter(
        participation => (participation.user.id |> isIn(followedUserIds))
      )
    ),
    [participationsToShow, followedUserIds]
  )

  const stopEditFollowed = useCallback(
    () => { setEditFollowed(false) },
    [setEditFollowed]
  )

  if (!edition) return null
  if ((!participations && loading))
    return (
      <div
        className="d-flex align-items-center justify-content-center"
        ref={el => {
          if (el && !el.sizeHandled) {
            el.sizeHandled = true
            const room = window.innerHeight - (document.getElementById("app").getBoundingClientRect().bottom + window.scrollY)
            el.style.height = `${el.getBoundingClientRect().height + room}px`
          }
        }}
      >
        <Loader />
      </div>
    )

  return (
    <ItemsContext.Provider value={itemsCtxMemoizedValue}>
      <Toolbar editFollowed={editFollowed} stopEditFollowed={stopEditFollowed} />
      {
        participationsToShow.length
          ? (
            <div className={cn({ "animate-fade-in-up": animated })}>
              {features.followAuthors && followedParticipations && !!followedParticipations.length && !effectiveSearch && (
                <>
                  <div
                    onClick={e => { setShowFollowedParticipations(!showFollowedParticipations) }}
                    className="group-title group-togglable"
                  >
                    {t(`participations-page.groups.followed.title`)}
                    {
                      showFollowedParticipations && !editFollowed && (
                        <span className="group-action group-edit" onClick={e => {
                          e.stopPropagation()
                          setEditFollowed(true)
                          setCompletion("all")
                          setGalleryMode(false)
                        }}>
                          <EditIcon style={{ height: "1em", width: "1em" }} />
                        </span>
                      )
                    }
                  </div>
                  <Collapse isOpen={showFollowedParticipations}>
                    <div className="followed-group">
                      <Participations forceNoReadStatuses>
                        {followedParticipations}
                      </Participations>
                    </div>
                  </Collapse>
                  <div className="group-title">
                    {t(`participations-page.groups.all.title`)}
                  </div>
                </>
              )}
              <Participations>
                {participationsToShow}
              </Participations>
            </div>
          )
          : (
            <>
              <div className="py-5 text-center text-muted">
                {t(`participations-page.user-search.empty`)}
              </div>
              {
                !!effectiveSearch && (
                  <SearchInOtherEditions
                    key={effectiveSearch}
                    effectiveSearch={effectiveSearch}
                  />
                )
              }
            </>
          )
      }
      {
        quickOpenedParticipationId && (
          <ParticipationDesktopQuickOpen participationId={quickOpenedParticipationId} />
        )
      }
    </ItemsContext.Provider>
  )
}


export function Participations({
  children: participations,
  forceNoReadStatuses,
}) {
  const {
    galleryMode,
    showReadStatuses,
  } = useContext(FiltersContext)
  const { editFollowed } = useContext(ItemsContext)
  const { getReadCompletion } = useReadStatuses()
  const ParticipationsComponentToUse = galleryMode ? ParticipationsGrid : ParticipationsList
  const [setFollowed] = useFollow()
  const followedUserIds = useFollowedUserIds()

  return (
    <ParticipationsComponentToUse>
      {
        participations.map((participation, i) => (
          <ParticipationsComponentToUse.Item
            key={participation.id}
            participation={participation}
            readCompletion={getReadCompletion(participation.id, participation.pagesDone)}
            showReadStatuses={showReadStatuses && !forceNoReadStatuses}
            {...(
              editFollowed
                ? {
                  followed: (participation.user.id |> isIn(followedUserIds)),
                  setFollowed: setFollowed.bind(null, participation),
                }
                : undefined
            )}
          />
        ))
      }
    </ParticipationsComponentToUse>
  )
}

function useQuickOpen(participations) {
  const { history, location } = useRouter()
  const mobileReaderMode = useMobileReaderMode()
  
  const quickOpenedSlug = qs.parse(location.search).quick_open
  const quickOpenedParticipationId = (
    quickOpenedSlug
    &&
    participations.find(participation => participation.user.slug === quickOpenedSlug).id
  )

  const quickOpenRef = useRef()
  quickOpenRef.current = (
    mobileReaderMode
      ? undefined
      : (
        slug => {
          history.push({
            search: qs.stringify({
              ...(qs.parse(location.search)),
              quick_open: slug,
              quick_open_page: 1
            })
          })
        }
      )
  )

  return [quickOpenedParticipationId, quickOpenRef]
}

export const ItemsContext = createContext()


function useFollowedUserIds() {
  const { data: { me } } = useQuery(
    gql`
      query Follows {
        me {
          id
          followedUsers {
            id
          }
        }
      }
    `,
    { fetchPolicy: 'cache-only' }
  )
  return useMemo(
    () => (
      me
        ? me.followedUsers.map(user => user.id)
        : []
    ),
    [me && me.followedUsers]
  )
}

const withFiltersProvider = ChildComponent =>
  props => (
    <FiltersProvider edition={props.edition}>
      <ChildComponent {...props} />
    </FiltersProvider>
  )

const withParticipations = withQueryResult(
  EDITION_PARTICIPATIONS_QUERY,
  {
    variables: ({ edition }) => ({
      editionId: edition.id
    }),
    props: ({ edition }) => ({ participations: edition.participations }),
    renderOnlyIfData: false,
    if: ({ edition }) => edition
  }
)

const withEdition = withQueryResult(
  EDITION_QUERY,
  {
    variables: ({ editionYear }) => ({
      year: editionYear
    })
  }
)

const enhance = compose(
  withEdition,
  withParticipations,
  withFiltersProvider
)

export default enhance(EditionParticipations)