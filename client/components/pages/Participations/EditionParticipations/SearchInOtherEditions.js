import React, { useState, useEffect, useRef, createContext } from 'react'
import { Query } from '@apollo/react-components'
import {
  SearchUser as SEARCH_USER_QUERY,
  ParticipationDesktopQuickOpen as ParticipationDesktopQuickOpenQuery,
} from '../operations.gql'
import FakeLoader from 'components/FakeLoader'
import { Participations } from '.'

function SearchInOtherEditions({ effectiveSearch }) {
  const callbackRef = useRef()
  const [active, setActive] = useState(false)

  useEffect(
    () => {
      // forceCheck()
      callbackRef.current = setTimeout(
        () => { setActive(true) },
        1200
      )
      return () => {
        clearTimeout(callbackRef.current)
      }
    },
    []
  )

  if (!active) return null

  return (
    <Query query={SEARCH_USER_QUERY} variables={{ search: effectiveSearch }}>
      {
        ({ data, loading, error }) => (
          (loading || error || !data.searchUser.length)
            ? null
            : (
              <FakeLoader duration={800} className="pb-4">
                <div style={{ fontSize: "0.9em"}}>
                  <div className="animate-fade-in-up mb-2"><strong>
                    {t(`participations-page.user-search.results-in-other-editions`)}
                  </strong></div>
                  <SearchResultsFromOtherEditionsContext.Provider value>
                    <Participations forceNoReadStatuses>
                      {data.searchUser}
                    </Participations>
                  </SearchResultsFromOtherEditionsContext.Provider>
                </div>
              </FakeLoader>
            )
        )
      }
    </Query>
  )
}

export const SearchResultsFromOtherEditionsContext = createContext()

export default SearchInOtherEditions
