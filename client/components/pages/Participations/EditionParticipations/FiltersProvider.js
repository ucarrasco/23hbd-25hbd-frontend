import React, { useState, useEffect, createContext, useMemo } from 'react'
import Fuse from 'fuse.js'
import moment from 'moment'
import { Query } from '@apollo/react-components'
import gql from 'graphql-tag'
import qs from 'query-string'
import useRouter from 'utils/useRouter'
import useMe from 'utils/useMe'
import useUserPreference from 'utils/useUserPreference'
import camelCase from 'lodash/camelCase'
import snakeCase from 'lodash/snakeCase'

export const FiltersContext = createContext()

const FiltersProvider = ({ children, edition }) => {
  const { location, history } = useRouter()
  const isDuringOrBefore = useMemo(
    () => !!edition && moment().isBefore(moment(edition.endDate)),
    [edition]
  )

  const defaultCompletionFilter = isDuringOrBefore ? 'all' : 'nonEmpty'
  const { c } = qs.parse(location.search)
  const completion = c ? camelCase(c) : defaultCompletionFilter
  useEffect(
    () => {
      if (!c) {
        setCompletion(defaultCompletionFilter)
      }
    },
    []
  )

  const setCompletion = compl => {
    history.replace({ search: qs.stringify({ ...qs.parse(location.search), c: snakeCase(compl) }) })
  }

  const SEARCH_DELAY = 0 // there use to be a delay like 400 here but it's not needed anymore since some performance optimizations
  const [ search, effectiveSearch, setSearch ] = useDelayedSearch(SEARCH_DELAY)

  const filterParticipations = participations => {
    if (!participations) return null

    const fuse = new Fuse(participations, {
      shouldSort: true,
      threshold: 0.3,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: [
        "specificUsername",
        "user.username",
        "title",
      ]
    })

    if (effectiveSearch) // search = ignore completion filter, to avoid "I can't find the user ..." frustration
      return fuse.search(effectiveSearch)

    if (completion !== 'all')
      participations = (
        completion === 'full'
          ? participations.filter(p => p.pagesDone >= p.pagesGoal)
          : participations.filter(p => p.pagesDone)
      )

    return participations
  }

  const galleryMode = qs.parse(location.search).view_mode === 'gallery'
  const setGalleryMode = active => {
    history.push({
      pathname: location.pathname,
      search: qs.stringify({
        ...qs.parse(location.search),
        view_mode: active ? 'gallery' : undefined
      })
    })
  }

  const [showReadStatuses, setShowReadStatuses] = useUserPreference('showReadStatuses')

  return (
    <FiltersContext.Provider
      value={{
        completion,
        setCompletion,
        search,
        effectiveSearch,
        setSearch,
        filtersValues: [ completion, effectiveSearch ],
        filterParticipations,
        galleryMode,
        setGalleryMode,
        showReadStatuses,
        setShowReadStatuses,
      }}
    >
      {children}
    </FiltersContext.Provider>
  )
}

const useDelayedSearch = (delay) => {
  const [search, setSearch] = useState("")
  const [effectiveSearch, setEffectiveSearch] = useState("")
  const [searchApplication, setSearchApplication] = useState(null)

  useEffect(
    () => {
      if (searchApplication)
        clearTimeout(searchApplication)
      setSearchApplication(
        setTimeout(
          () => {
            setEffectiveSearch(search)
          },
          delay
        )
      )
    },
    [search]
  )

  useEffect(
    () => {
      return function cleanup() {
        if (searchApplication)
          clearTimeout(searchApplication)
      }
    }
  )

  return [search, effectiveSearch, setSearch]
}

export default FiltersProvider
