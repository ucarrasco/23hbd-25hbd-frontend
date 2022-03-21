import React from 'react'
import {
  ParticipationDesktopQuickOpen as ParticipationDesktopQuickOpenQuery,
} from '../operations.gql'
import { Redirect } from 'react-router'
import useRouter from 'utils/useRouter'
import { useQuery } from '@apollo/react-hooks'
import { DesktopReader } from '../../Participation/Desktop'
import useMobileReaderMode from 'utils/useMobileReaderMode'
import qs from 'query-string'

function ParticipationDesktopQuickOpen({ participationId }) {
  const { history, location } = useRouter()
  const currentPage = parseInt(qs.parse(location.search).quick_open_page)
  const setCurrentPage = pageNumber => {
    history.push({
      search: qs.stringify({
        ...(qs.parse(location.search)),
        quick_open_page: pageNumber.toString()
      })
    })
  }
  const onClose = () => {
    history.push({
      search: qs.stringify({
        ...(qs.parse(location.search)),
        quick_open: undefined,
        quick_open_page: undefined,
      })
    })
  }
  const mobileReaderMode = useMobileReaderMode()
  const { data, loading, error } = useQuery(
    ParticipationDesktopQuickOpenQuery,
    { variables: { participationId }}
  )
  if (loading || error) return null
  if (mobileReaderMode) {
    return (
      <Redirect replace to={`/participants/${data.participation.edition.year}/${data.participation.user.slug}/?page=${currentPage}`} />
    )
  }
  return (
    <DesktopReader
      participation={data.participation}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      onClose={onClose}
    />
  )
}

export default ParticipationDesktopQuickOpen
