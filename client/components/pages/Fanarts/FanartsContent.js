import React, { useState, useEffect } from 'react'
import { Row, Col, Card, CardImg, CardBody, CardText } from 'reactstrap'
import zip from 'lodash/zip'
import Lightbox from 'react-images'
import styled from 'styled-components'
import mdToHtml from 'common/mdToHtml'

function s3ToCloudfrontUrl(url) {
  if (process.env.CLOUDFRONT_DOMAIN) {
    return url.replace(`http://${process.env.S3_BUCKET}.s3.amazonaws.com/`, `https://${process.env.CLOUDFRONT_DOMAIN}/`)
  }
  return url
}

export default function FanartsContent({ children }) {
  const imgRegex = /!\[[^\]]*\]\([^)]*\)/
  const imageUrls = [...children.match(new RegExp(imgRegex.source, imgRegex.flags + "g")) || []].map(
    imgCode => imgCode.match(/!\[[^\]]*\]\(([^)]*)\)/)[1]
  )
  const [edito, ...contents] = children.split(imgRegex)

  const fanarts = zip(imageUrls, contents).map(
    ([imgUrl, content], i) => ({
      key: `${imgUrl}-${i}`,
      imgUrl: s3ToCloudfrontUrl(imgUrl),
      htmlContent: mdToHtml(content),
    })
  )

  const [lightboxIndex, setLightboxIndex] = useState(-1)
  useEffect(() => {
    setLightboxIndex(-1)
  }, [children])

  return (
    <React.Fragment>
      <Edito dangerouslySetInnerHTML={{ __html: mdToHtml(edito) }} />
      <Row>
        {
          fanarts.map(
            (fanart, i) => (
              <Col key={fanart.key} xs={6} md={4} lg={3}>
                <Fanart
                  {...fanart}
                  onClick={() => { setLightboxIndex(i) }}
                  className="my-2"
                />
              </Col>
            )
          )
        }
      </Row>
      <Lightbox
        images={fanarts.map(({ imgUrl, htmlContent }) => ({ src: imgUrl, caption: <span dangerouslySetInnerHTML={{ __html: htmlContent }} /> }))}
        isOpen={lightboxIndex !== -1}
        onClickPrev={() => { setLightboxIndex(lightboxIndex - 1) }}
        onClickNext={() => { setLightboxIndex(lightboxIndex + 1) }}
        currentImage={lightboxIndex !== -1 ? lightboxIndex : undefined}
        onClose={() => { setLightboxIndex(-1) }}
        backdropClosesModal={true}
        imageCountSeparator=" sur "
        width={1200}
    />
    </React.Fragment>
  )
}

const Edito = styled.div`
  font-size: 1rem;
  h1 {
    margin-bottom: 30px;
  }
`

function Fanart({ imgUrl, htmlContent, ...props }) {
  return (
    <Card style={{ cursor: "pointer" }} {...props}>
      <CardImg top src={imgUrl} alt="" style={{ height: 200, objectFit: 'cover' }} />
      <CardBody className="p-3">
        <CardText dangerouslySetInnerHTML={{ __html: htmlContent }} />
      </CardBody>
    </Card>
  )
}
