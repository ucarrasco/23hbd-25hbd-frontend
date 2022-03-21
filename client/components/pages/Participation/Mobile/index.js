import React, { useState, useEffect, useMemo } from 'react'
import { PhotoSwipe } from 'utils/PhotoSwipe'
import withQueryResult from 'utils/withQueryResult'
import { Modal, ModalHeader, ModalBody } from 'reactstrap'
import Comments from '../Comments'
import Reactions from '../Reactions'
import Author from '../Author'
import escapeHtml from 'escape-html'
import Toolbar from './Toolbar'
import useRouter from 'utils/useRouter'
import useReadStatuses from 'utils/useReadStatuses'
import BodyChildPortal from 'utils/BodyChildPortal'
import WebtoonReader from '../WebtoonReader'
import { ParticipationMobilePage } from '../operations.gql'
import qs from 'query-string'

const MobileParticipation = ({ participation }) => {
  const { history, location } = useRouter()
  const [ infoMode, setInfoMode ] = useState(false)
  const [ authorMode, setAuthorMode ] = useState(false)
  const { readPage } = useReadStatuses()
  const themeColorMeta = useMemo(() => document.querySelector("meta[name=theme-color]"), [])
  const [currentPageNumber, setCurrentPageNumber] = useState(1)
  useEffect(
    () => {
      readPage(participation.id, currentPageNumber)
    },
    [currentPageNumber]
  )
  useEffect(() => { // this can be removed with 23hbd-2020 layout
    document.body.classList.add('mobile-reader-mode')
    const initialThemeColor = themeColorMeta.content
    themeColorMeta.content = "#000000"
    return () => {
      document.body.classList.remove('mobile-reader-mode')
      themeColorMeta.content = initialThemeColor
    }
  }, [])
  const items = useMemo(
    () => (
      participation.pages.length
        ? (
          participation.pages.map(
            (page, i) => ({
              src: page.url,
              w: page.width,
              h: page.height,
              title: `Page ${i + 1}`
            })
          )
        )
        : [{
          html: `<div class="h-100 d-flex align-items-center justify-content-center" style="font-size: 1.1rem">
            ${escapeHtml(t(`participation-page.empty`))}
          </div>`
        }]
    ),
    [participation.pages]
  )
  return (
    <BodyChildPortal>
      <>
        {
          participation.challengeType === 'webtoon'
            ? (
              <WebtoonReader
                participation={participation}
                toolbar={
                  <Toolbar
                    participation={participation}
                    onInfoClick={
                      () => {
                        setInfoMode(true)
                      }
                    }
                    onAuthorClick={
                      () => {
                        setAuthorMode(true)
                      }
                    }
                    standalone
                  />
                }
                setCurrentPage={
                  pageNumber => {
                    history.replace({
                      search: qs.stringify({
                        ...(qs.parse(location.search)),
                        page: pageNumber.toString()
                      })
                    })
                  }
                }
                onClose={() => { history.goBack() }}
              />
            )
            : (
              <PhotoSwipe
                isOpen={true}
                items={items}
                options={{
                  pinchToClose: false,
                  shareEl: false,
                  barsSize: { top: 60, bottom: 'auto' },
                  loop: false,
                  captionEl: false,
                  zoomEl: false,
                  preloaderEl: false,
                  arrowEl: false,
                  history: false,
                }}
                onClose={() => { history.goBack() }}
                afterChange={(e) => {
                  setCurrentPageNumber(e.getCurrentIndex() + 1)
                }}
                toolbar={
                  <Toolbar
                    participation={participation}
                    onInfoClick={
                      () => {
                        setInfoMode(true)
                      }
                    }
                    onAuthorClick={
                      () => {
                        setAuthorMode(true)
                      }
                    }
                  />
                }
              />
            )
        }
        <Modal isOpen={infoMode} toggle={() => { setInfoMode(false) }} centered contentClassName="bg-light">
          <ModalHeader toggle={() => { setInfoMode(false) }}>
            {t(`participation-page.comments.title`)}
          </ModalHeader>
          <ModalBody>
            {
              participation.allowReactions && (
                <Reactions
                  participationId={participation.id}
                  className="mb-4"
                />
              )
            }
            <Comments participationId={participation.id} />
          </ModalBody>
        </Modal>
        <Modal isOpen={authorMode} toggle={() => { setAuthorMode(false) }} centered contentClassName="bg-light">
          <ModalHeader toggle={() => { setAuthorMode(false) }}>
            {t(`participation-page.author.title`)}
          </ModalHeader>
          <ModalBody>
            <Author userId={participation.user.id} />
          </ModalBody>
        </Modal>
      </>
    </BodyChildPortal>
  )
}

const withParticipation = withQueryResult(
  ParticipationMobilePage,
  {
    variables: ({ participationId }) => ({ participationId })
  }
)

export default withParticipation(MobileParticipation)

