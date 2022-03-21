import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import ChallengeTypeForm from './ChallengeTypeForm'
import PlancheUploadForm from './PlancheUploadForm'
import Well from 'components/Well'
import { SortableContainer, SortableElement } from 'react-sortable-hoc'
import withQueryResult from 'utils/withQueryResult'
import compose from 'utils/compose'
import gql from 'graphql-tag'
import withMutation from 'utils/withMutation'
import PageDragAndDropContainer from './PageDragAndDropContainer'
import { Button } from 'reactstrap'
import Achievement from '../../../Achievement'
import cn from 'classnames'
import styled from 'styled-components'
import { policies, strings } from 'common/flavorConfig.hbd'
import moment from 'moment'
import RelevantEditionContext from '../RelevantEditionContext'
import isIn from 'common/fp/isIn'
import { Trans } from 'react-i18next'
import { Link } from 'react-router-dom'
import { FormGroup, Input, Label, Form, Row, Col, FormFeedback } from 'reactstrap'
import { reduxForm, Field } from 'redux-form'
import { useMutation } from '@apollo/react-hooks'
import emojiRegex from 'emoji-regex'

const Planches = ({ pages, movePage, participation, participationId, deletePage, edition }) => {
  const [ reorderMode, setReorderMode ] = useState(false)
  const now = moment()
  return (
    <PageDragAndDropContainer disabled={!edition.status.usersCanUpload}>
      {
        (policies.challengeTypes.length > 1) && (
          <React.Fragment>
            <ChallengeTypeForm participationId={participationId} />
            <hr />
          </React.Fragment>
        )
      }
      {
        edition.status.usersCanUpload
          ? (
            <React.Fragment>
              {
                now.isAfter(moment(edition.endDate)) && (participation.achievement |> isIn(['gold', 'pink'])) && (
                  <div className="post-it-info mb-4 mx-5">
                    <Trans i18nKey="account-page.planches-page.lose-achievement-warning">
                      <strong>Attention !</strong> Le temps est fini, si tu fais des modifications maintenant, tu perdras {{ yourAchievement: t(`flavored:global.your-${participation.achievement}-achievement`) }} !
                    </Trans>
                  </div>
                )
              }
              <PlancheUploadForm participationId={participationId} />
            </React.Fragment>
          )
          : (
            <div className="bg-grey h5 mx-5 p-4 text-center">
              {
                now.isAfter(moment(edition.endDate))
                  ? t(`account-page.planches-page.upload-not-possible-anymore`)
                  : t(`account-page.planches-page.upload-not-possible-yet`)
              }
            </div>
          )
      }

      {
        !!pages.length && (
          <Well>

            {
              edition.useTitles && pages.length !== 0 && (
                <TitleEdit participationId={participationId} title={participation.title} />
              )
            }
            <PlanchesList
              pages={pages}
              axis="xy"
              distance={3}
              onSortEnd={({ oldIndex, newIndex }) => { if (oldIndex != newIndex) movePage(oldIndex, newIndex) }}
              deletePage={deletePage}
              reorderEnabled={reorderMode}
            />
            <div className="d-flex align-items-center mt-3" style={{
              borderTop: "solid 1px rgba(0,0,0,0.1)",
              marginBottom: -8,
              paddingTop: 12
            }}>
              <div className="flex-grow-1">
                {
                  pages.length >= 2 && (
                    <React.Fragment>
                      {
                        reorderMode
                          ? (
                              <Button
                                color="primary"
                                size="sm"
                                onClick={() => setReorderMode(false)}
                              >
                                {t(`account-page.planches-page.reorder-mode.end`)}
                              </Button>
                          )
                          : (
                            <Button
                              color="hbd"
                              size="sm"
                              onClick={() => setReorderMode(true)}
                            >
                              {t(`account-page.planches-page.reorder-mode.start`)}
                            </Button>
                          )
                      }
                      <ReorderInstructions className={cn("ml-3 d-none d-md-inline", { show: reorderMode })}>
                        {t(`account-page.planches-page.reorder-mode.instructions`)}
                      </ReorderInstructions>
                    </React.Fragment>
                  )
                }
              </div>
              <div>
                <span style={{ whiteSpace: "nowrap" }}>{participation.pagesDone} / {participation.pagesGoal}</span>
                <Achievement achievement={participation.achievement} className="ml-1" yFix />
              </div>
            </div>
          </Well>
        )
      }
      <div style={{ fontSize: 13 }}>
        {t(`account-page.planches-page.link-to-my-participation`)}
        {" "}
        <Link to={`/participants/${edition.year}/${participation.user.slug}/`} className="link-alt link-underlined">
          {`${process.env.HTTP_HOST}/participants/${edition.year}/${participation.user.slug}/`}
        </Link>
      </div>
    </PageDragAndDropContainer>
  )
}

function TitleEdit({ participationId, title: baseTitle }) {
  const [title, setTitle] = useState(baseTitle || "")
  useEffect(
    () => {
      setTitle(baseTitle || "")
    },
    [baseTitle || ""]
  )
  const [updateTitle] = useMutation(
    gql`
      mutation UpdateParticipationTitle($participationId: ID!, $title: String) {
        updateParticipation(
          participationId: $participationId
          title: $title
        ) {
          id
          title
        }
      }`,
      {
        variables: {
          participationId,
          title: title || null,
        },
        onCompleted: () => {
          toast.success(t(`account-page.planches-page.title-edit.success`))
        }
    }
  )
  const lengthError = title.length > 100
  const emojiError = !!title.match(emojiRegex())
  return (
    <Form onSubmit={e => { e.preventDefault(); updateTitle() }}>
      <FormGroup>
        <Row>
          <Col md={6}>
            <Label>
              {t(`flavored:account-page.planches-page.title-edit.label`)}
            </Label>
            <div className="d-flex align-items-start">
              <div className="flex-grow-1">
                <Input
                  type="text"
                  name="title"
                  value={title}
                  onChange={e => { setTitle(e.target.value) }}
                  invalid={lengthError || emojiError}
                />
                {
                  lengthError && (
                    <FormFeedback>{t(`account-page.planches-page.title-edit.errors.max-characters`, { max: 100 })}</FormFeedback>
                  )
                }
                {
                  !lengthError && emojiError && (
                    <FormFeedback>{t(`account-page.planches-page.title-edit.errors.emojis`)}</FormFeedback>
                  )
                }
              </div>
              {
                (title !== (baseTitle || "")) && (
                  <>
                    <Button color="primary" type="submit" className="ml-3" disabled={lengthError || emojiError}>
                      {t(`account-page.planches-page.title-edit.save`)}
                    </Button>
                    <Button color="default" onClick={() => { setTitle(baseTitle || "") }} className="ml-1">
                      {t(`account-page.planches-page.title-edit.cancel`)}
                    </Button>
                  </>
                )
              }
            </div>
          </Col>
        </Row>
      </FormGroup>
    </Form>
  )
}

const ReorderInstructions = styled.span`
  opacity: 0;
  transition: opacity 0.15s linear;
  &.show {
    opacity: 1;
  }
`

const PlanchesList = SortableContainer(
  ({ pages, deletePage, reorderEnabled }) =>
    <div className="account-pages-list">
      {
        pages.map(
          (page, i) =>
            <Planche
              key={i + 1}
              {...page}
              number={i + 1}
              index={i}
              pageIndex={i}
              deletePage={deletePage.bind(null, i)}
              reorderEnabled={reorderEnabled}
              disabled={!reorderEnabled}
            />
        )
      }
    </div>
)

const Planche = SortableElement(
  ({ url, number, deletePage, reorderEnabled }) =>
    <div className={cn("account-planche")}>
      <a target="blank" href={url} className={cn("img-container", { "animate-jiggle": reorderEnabled })}>
        <img src={url} alt={t(`account-page.planches-page.planche-img-alt`, { number })} />
      </a>
      <span className="delete-button-container">
        <span className="icon-cross" onClick={_ => { deletePage() }}></span>
      </span>
    </div>
)

const withDeletePage = withMutation(
  gql`
    mutation DeletePage($participationId: ID!, $pageIndex: Int!) {
      deletePage(
        participationId: $participationId
        pageIndex: $pageIndex
      ) {
        id
        pagesDone
        achievement
        pages {
          url
          width
          height
        }
      }
    }
  `,
  (mutate, { participationId }) => ({
    deletePage: pageIndex => mutate({
      variables: {
        participationId,
        pageIndex
      }
    }).then(_ => { toast.success(t(`account-page.planches-page.planche-delete-done`)) })
  })
)

const withMovePage = withMutation(
  gql`
    mutation UpdatePagesOrder($participationId: ID!, $oldPageIndex: Int!, $newPageIndex: Int!) {
      updatePagesOrder(
        participationId: $participationId
        oldPageIndex: $oldPageIndex
        newPageIndex: $newPageIndex
      ) {
        id
        achievement
        pages {
          url
          width
          height
        }
      }
    }
  `,
  (mutate, { participationId, pages }) => ({
    movePage: (oldPageIndex, newPageIndex) => mutate({
      variables: {
        participationId,
        oldPageIndex,
        newPageIndex
      },
      optimisticResponse: {
        __typename: "Mutation",
        updatePagesOrder: {
          id: participationId,
          __typename: "Participation",
          pages: (function(pages) {
            let updatedPages = [...pages]
            updatedPages.splice(newPageIndex, 0, updatedPages.splice(oldPageIndex, 1)[0])
            return updatedPages
          })(pages)
        }
      }
    }).then(_ => { toast.success(t(`account-page.planches-page.reorder-mode.done`)) })
  })
)

const withPages = withQueryResult(
  gql`
    query Pages($participationId: ID!) {
      participation(id: $participationId) {
        id
        pagesDone
        pagesGoal
        achievement
        title
        user {
          id
          slug
        }
        pages {
          url
          width
          height
        }
      }
    }
  `,
  {
    variables: ({ participationId }) => ({ participationId }),
    props: ({ participation }) => ({
      participation,
      pages: participation.pages // shortcut prop, deal with it
    })
  }
)

const withEditionInfo = withQueryResult(
  gql`
    query EditionInfo($editionId: ID!) {
      edition(id: $editionId) {
        id
        beginDate
        endDate
        year
        status {
          usersCanUpload
        }
        useTitles
      }
    }
  `,
  { variables: ({ editionId }) => ({ editionId }) }
)

const withRelevantEditionIdAndParticipationId = ChildComponent => props => (
  <RelevantEditionContext.Consumer>
    {
      ({ relevantEdition }) => (
        <ChildComponent
          editionId={relevantEdition && relevantEdition.id}
          participationId={relevantEdition && relevantEdition.myParticipation && relevantEdition.myParticipation.id}
          {...props}
        />
      )
    }
  </RelevantEditionContext.Consumer>
)

const enhance = compose(
  withRelevantEditionIdAndParticipationId,
  withEditionInfo,
  withPages,
  withMovePage,
  withDeletePage
)

export default enhance(Planches)