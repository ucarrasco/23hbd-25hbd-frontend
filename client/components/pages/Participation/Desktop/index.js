import React, { useMemo } from 'react'
import Well, { WellTitle } from 'components/Well'
import { Row, Col, Breadcrumb, BreadcrumbItem } from 'reactstrap'
import Author from '../Author'
import withQueryResult from 'utils/withQueryResult'
import Comments from '../Comments'
import Achievement from 'components/Achievement'
import ParticipationContext from '../ParticipationContext'
import moment from 'moment'
import Reactions from '../Reactions'
import useRouter from 'utils/useRouter'
import LightboxViewer from './LightboxViewer'
import TwitchWidgetMaybe from './TwitchWidgetMaybe'
import styled from 'styled-components'
import qs from 'query-string'
import WebtoonReader from '../WebtoonReader'
import { Link } from 'react-router-dom'
import { ParticipationDesktopPage } from '../operations.gql'

const Participation = ({ participation }) => {
  const { history, location } = useRouter()
  const openPage = pageIndex => {
    history.replace({ search: `?page=${pageIndex + 1}` })
  }

  const customParticipationIframe = participation.customData && participation.customData.participationIframe
  const now = useMemo(() => moment(), [])
  const editionHasNotStartedYet = now.isBefore(moment(participation.edition.beginDate))
  const readerIsOpen = !!qs.parse(location.search).page

  return (
    <ParticipationContext.Provider value={{ participation }}>
      <Paincrumb>
        <BreadcrumbItem>
          <Link to={`/participants/${participation.edition.year}/`}>
            {t(`participation-page.breadcrumb.participations-page`, { year: participation.edition.year })}
          </Link>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <a href="">
            {t(`participation-page.breadcrumb.participation-page`, { username: participation.specificUsername || participation.user.username })}
          </a>
        </BreadcrumbItem>
      </Paincrumb>
      <div>
        <Row>
          <Col lg={8}>
            {
              participation.disclaimer && (
                <Well alt>
                  {/* <WellTitle>Notes de l'auteur</WellTitle> */}
                  <div
                    style={{ fontSize: "1rem" }}
                    dangerouslySetInnerHTML={{ __html: participation.disclaimer }}
                  />
                </Well>
              )
            }
            {
              !!customParticipationIframe && (
                <Well alt>
                  <div
                    className="d-flex align-items-center justify-content-center"
                    dangerouslySetInnerHTML={{
                      __html: customParticipationIframe
                    }}
                  />
                </Well>
              )
            }
            {
              (!customParticipationIframe || !!participation.pages.length) && (
                  <Well alt className="mb-0">
                    <WellTitle>
                      <div className="d-flex align-items-center">
                        <Title>
                          {(participation.edition.useTitles && participation.title) || t(`participation-page.planches.title`)}
                        </Title>
                        <PagesCount>
                          {`${participation.pagesDone}/${participation.pagesGoal}`}
                          {
                            participation.achievement && (
                              <Achievement
                                style={{ left: 4 }}
                                yFix
                                altSilver
                                className="ml-2"
                              >
                                {participation.achievement}
                              </Achievement>
                            )
                          }
                        </PagesCount>
                      </div>
                    </WellTitle>
                    {
                      participation.pages.length
                        ? (
                          <div className="d-flex flex-wrap">
                            {
                              participation.pages.map((page, i) =>
                                <Planche
                                  key={i}
                                  page={page}
                                  pageNumber={i + 1}
                                  openPage={openPage.bind(null, i)}
                                />
                              )
                            }
                            {readerIsOpen && <RoutedReader participation={participation} />}
                          </div>
                        )
                        : (
                          <div className="text-center text-muted-light py-3" style={{ fontSize: "1.2em" }}>
                            {t(`participation-page.empty-desktop`)}
                          </div>
                        )
                    }
                  </Well>
                )
            }

            <TwitchWidgetMaybe participation={participation} />

            {
              (participation.allowReactions && !editionHasNotStartedYet) && (
                <Reactions
                  participationId={participation.id}
                  className="mt-2 p-3 mb-2"
                />
              )
            }
          </Col>

          <Col lg={4}>
            <Well title={t(`participation-page.author.title`)} alt>
              <Author userId={participation.user.id} />
            </Well>
          </Col>

        </Row>

        {
          participation.allowComments && (
            <Comments
              participationId={participation.id}
              style={{ borderTop: "solid 1px #ccc" }}
              className="pt-4 mt-5"
            />
          )
        }
      </div>
    </ParticipationContext.Provider>
  )
}

const Paincrumb = styled(Breadcrumb)`
  // cancel container margins
  margin: -1.5rem -1.5rem 0 -1.5rem;
  // override default Breadcrumb styles
  .breadcrumb {
    padding: 0.52rem 1rem 0.26rem;
    margin-bottom: 2rem;
    background-color: #efefef;
    color: #9c9d9e;
    border-bottom: solid 1px #ececec;
    border-radius: 0;
    font-size: 0.83rem;
  }
  .breadcrumb-item a {
    color: inherit;
  }
  .breadcrumb-item + .breadcrumb-item::before {
    color: inherit;
    content: "»";
  }
`

const Title = styled.div`
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
`

function RoutedReader({ participation }) {
  const { location, history } = useRouter()
  const pageNumberStrFromUrl = qs.parse(location.search).page
  const currentPageNumber = parseInt(pageNumberStrFromUrl)
  return (
    <DesktopReader
      participation={participation}
      currentPage={currentPageNumber}
      setCurrentPage={
        pageNumber => { history.replace({ search: `?page=${pageNumber}`}) }
      }
      onClose={
        () => { history.replace({ search: "" }) }
      }
    />
  )
}

export function DesktopReader(props) {
  if (props.participation.challengeType === 'webtoon')
    return <WebtoonReader {...props} />
  return <LightboxViewer {...props} />
}

const PagesCount = styled.div`
  height: 1.9rem;
  line-height: 1.9rem;
  border-radius: 0.95rem;
  background-color: #999;
  margin-left: 0.5em;
  font-size: 1rem;
  color: #eee;
  text-shadow: -1px -1px #777;
  padding: 0 1.2em;
  margin-top: 6px;
`

const Planche = ({
  page,
  openPage,
  pageNumber,
  ...otherProps
}) => {
  const dimensions = {
    width: Math.round((page.width / page.height) * 125),
    height: 125,
  }
  return (
    <div className="account-planche" {...otherProps}>
      <a
        target="blank"
        href={page.url}
        onClick={e => { e.preventDefault(); openPage() }}
        className="img-container"
        style={dimensions}
      >
        <img
          src={page.thumbnail.url}
          alt={`Page ${pageNumber}`}
          // className="animated"
          style={{
            ...dimensions,
            animationDelay: `${(pageNumber - 1) * 0.02}s`
          }}
        />
      </a>
    </div>
  )
}


const withParticipation = withQueryResult(
  ParticipationDesktopPage,
  {
    variables: ({ participationId }) => ({ participationId })
  }
)


const DesktopParticipation = withParticipation(Participation)

export default DesktopParticipation
