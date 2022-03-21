import React, { useRef } from 'react'
import { NavLink } from 'react-router-dom'
import { withRouter } from 'react-router'
import qs from 'qs'
import moment from 'moment'
import useRouter from 'utils/useRouter'

const EditionLinks = ({ editions }) => {
  const { location, match: { params: { year }} } = useRouter("/participants/:year/")
  const { c, view_mode } = qs.parse(location.search, { ignoreQueryPrefix: true })
  const { current: now } = useRef(moment())
  const activeEdition = editions.find(edition => edition.year === parseInt(year))
  const isCurrentAndNotEnded = edition => now.isBefore(moment(edition.endDate))
  return (
    <>
      <ul className="hbd-autbar__editions  d-flex  flex-wrap  justify-content-center  mb-0">
        {
          editions.map((edition, i) => {
            return (
              <li key={i}>
                <NavLink
                  to={{
                    pathname: `/participants/${edition.year}/`,
                    search: qs.stringify(
                      {
                        view_mode: view_mode === 'gallery' ? 'gallery' : undefined,
                        c: ((activeEdition |> isCurrentAndNotEnded) || (edition |> isCurrentAndNotEnded)) ? undefined : c,
                      },
                      { addQueryPrefix: true }
                    )
                  }}
                  isActive={
                    (match, location) => {
                      return location.pathname === `/participants/${edition.year}/`
                    }
                  }
                  activeClassName="active"
                  >
                  {edition.year}
                </NavLink>
              </li>
            )
          })
        }
      </ul>
      <div className="hbd-autbar__editions-bottom-border-hack">
        <div></div>
      </div>
    </>
  )
}

export default EditionLinks