import React, { useEffect } from 'react'
import Lightbox from 'react-images'
import PreloadTurbomediaIfNeeded from './PreloadTurbomediaIfNeeded'
import qs from 'query-string'
import useRouter from 'utils/useRouter'
import useReadStatuses from 'utils/useReadStatuses'

function LightboxViewer({ participation, currentPage, setCurrentPage, onClose }) {
  const currentPageNumber = currentPage
  const currentPageIndex = currentPageNumber ? (currentPageNumber - 1) : undefined
  const { readPage } = useReadStatuses()
  useEffect(
    () => {
      readPage(participation.id, currentPageNumber)
    },
    [currentPageNumber]
  )
  return (
    <PreloadTurbomediaIfNeeded
      isOpen
      participation={participation}
    >
      <Lightbox
        images={participation.pages.map(({ url }) => ({ src: url }))}
        isOpen
        onClickPrev={() => { setCurrentPage(currentPageNumber - 1) }}
        onClickNext={() => { setCurrentPage(currentPageNumber + 1) }}
        currentImage={currentPageIndex}
        onClose={onClose}
        backdropClosesModal={true}
        imageCountSeparator={` ${t(`participation-page.planches.lightbox-image-count-separator`)} `}
        width={1200}
      />
    </PreloadTurbomediaIfNeeded>
  )
}

export default LightboxViewer
