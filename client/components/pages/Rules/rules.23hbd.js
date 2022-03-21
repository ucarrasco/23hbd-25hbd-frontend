import React, { useMemo } from 'react'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import moment from 'moment'
import { INSTRUCTIONS_KEY } from 'common/plancheUploadPolicy'
import mdToHtml from 'common/mdToHtml'

export default function Rules() {
  const { data: { currentEdition: { beginDate, endDate } }} = useQuery(
    gql`
      query CurrentEditionDates {
        currentEdition {
          id
          beginDate
          endDate
        }
      }
    `,
    { fetchPolicy: 'cache-only' }
  )

  const rulesHTML = useMemo(() => {
    const md = t(
      `flavored:rules-page.content`,
      {
        beginDate: moment(beginDate),
        endDate: moment(endDate),
        planchesUploadInstructions: {
          fileType: {
            classico: t(`${INSTRUCTIONS_KEY}.file-type.classico`),
            turbomedia: t(`${INSTRUCTIONS_KEY}.file-type.turbomedia`),
            webtoon: t(`${INSTRUCTIONS_KEY}.file-type.webtoon`),
          },
          imageDimensions: {
            classico: t(`${INSTRUCTIONS_KEY}.image-dimensions.classico`),
            turbomedia: t(`${INSTRUCTIONS_KEY}.image-dimensions.turbomedia`),
            webtoon: t(`${INSTRUCTIONS_KEY}.image-dimensions.webtoon`),
          }
        },
      }
    )
    const html = mdToHtml(md)
    return html
  })

  return  (
    <article
      dangerouslySetInnerHTML={{
        __html: rulesHTML,
      }}
    />
  )
}
