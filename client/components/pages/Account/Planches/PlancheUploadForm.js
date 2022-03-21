import React, { useCallback, useContext } from 'react'
import { Form, Row, Col, Button } from 'reactstrap'
import { toast } from 'react-toastify'
import gql from 'graphql-tag'
import withMutation from 'utils/withMutation'
import {
  ALLOWED_FILE_TYPES,
  MAXIMUM_FILE_SIZE,
  ALLOWED_FORMATS,
  FILE_TYPE_TO_EXT,
  MAXIMUM_FILE_SIZE_TEXT,
  INSTRUCTIONS_KEY,
} from 'common/plancheUploadPolicy'
import withQueryResult from 'utils/withQueryResult'
import PageDragAndDropContext from './PageDragAndDropContext'
import { Trans } from 'react-i18next'
import UploadsPanicMessageMaybe from './UploadsPanicMessageMaybe'
import Loader from 'components/Loader'

class PlancheUploadForm extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      file: undefined,
      imageDimensions: undefined
    }
    this.inputFileRef = React.createRef()
  }

  validateFile = (file) => {
    const { challengeType } = this.props
    if (ALLOWED_FILE_TYPES[challengeType].indexOf(file.type) === -1)
      return t(
        `account-page.planches-page.planche-upload.file-validation.invalid-file-type`,
        {
          allowedFileTypes: ALLOWED_FILE_TYPES[challengeType].map(fileType => FILE_TYPE_TO_EXT[fileType]).join(", "),
          fileType: file.type
        }
      )
    if (file.size > MAXIMUM_FILE_SIZE[file.type])
      return t(
        `account-page.planches-page.planche-upload.file-validation.invalid-file-size`,
        {
          maxFileSize: MAXIMUM_FILE_SIZE_TEXT,
          fileSize: `${Math.round(file.size / (1024*1024) * 10) / 10} Mo`
        }
      )
    return null
  }

  getInvalidImageReason() {
    const { challengeType } = this.props
    const { file, imageDimensions } = this.state
    if (!file) return null
    const fileError = this.validateFile(file)
    if (fileError)
      return fileError
    if (!imageDimensions)
      return t(`account-page.planches-page.planche-upload.file-validation.invalid-image`)
    if (ALLOWED_FORMATS[challengeType].indexOf(`${imageDimensions.width}x${imageDimensions.height}`) === -1)
      return t(
        `account-page.planches-page.planche-upload.file-validation.invalid-image-dimensions`,
        {
          allowedImageDimensions: ALLOWED_FORMATS[challengeType].join(", "),
          imageDimensions: `${imageDimensions.width}×${imageDimensions.height}`
        }
      )

    return null
  }

  resetInputFile() {
    this.inputFileRef.current.value = ""
    this.setState({
      file: undefined,
      imageDimensions: undefined
    })
  }

  // used from parent component through ref!!
  // before any change on this, search for PageDragAndDropContext in code
  dropFiles = async (files) => {
    const { addPage } = this.props
    if (this.state.loading) {
      toast.error(`Un upload est déjà en cours...`)
      return
    }
    this.resetInputFile()
    this.setState({ loading: true })
    try {
      for (const [i, file] of files.entries()) {
        if (i > 0) {
          await new Promise(resolve => { setTimeout(resolve, 300) })
        }
        const fileError = this.validateFile(file)
        if (fileError) {
          throw new FrontValidationError(fileError)
        }
        await addPage(file)
        toast.success(t(`account-page.planches-page.planche-upload.done`))
      }
    }
    catch(e) {
      if (e instanceof FrontValidationError) {
        toast.error(e.message)
      }
      else {
        toast.error(`Erreur à l'upload`)
      }
    }
    finally {
      this.setState({ loading: false })
    }
  }

  render() {
    const { addPage, challengeType, participationId } = this.props
    const { file, imageDimensions, loading } = this.state
    return (
      <div>
        {loading && (
          <div className="d-flex flex-column justify-content-center align-items-center my-3">
            <div style={{ fontSize: "1.2rem" }} className="mb-3">
              Envoi...
            </div>
            <Loader />
          </div>
        )}
        <div className={loading ? 'd-none' : undefined}>
          <UploadsPanicMessageMaybe participationId={participationId} />
          <Form
            className="pb-3"
            onSubmit={e => {
              e.preventDefault()
              addPage(file)
                .then(
                  () => {
                    this.resetInputFile()
                    toast.success(t(`account-page.planches-page.planche-upload.done`))
                  }
                )
            }}
          >

            <div className="text-center d-flex flex-column align-items-center">

              <div className="mt-3 mb-3">
                <div dangerouslySetInnerHTML={{ __html: t(`${INSTRUCTIONS_KEY}.file-type.${challengeType}`) }} />
                <div className="mt-1" dangerouslySetInnerHTML={{ __html: t(`${INSTRUCTIONS_KEY}.image-dimensions.${challengeType}`) }} />
              </div>

              <label>
                <span className="btn btn-primary" style={{ cursor: "pointer" }} tabIndex={-1}>
                  Choisir un fichier
                </span>
                <input
                  type="file"
                  accept={ALLOWED_FILE_TYPES[challengeType].join(",")}
                  ref={this.inputFileRef}
                  className="d-none"
                  onChange={
                    e => {
                      const input = e.target
                      const file = input.files[0]
                      if (!file) {
                        this.setState({
                          file: undefined,
                          imageDimensions: undefined
                        })
                        return
                      }
                      if (file.type.match(/^image\//)) {
                        const image = new Image()
                        image.src = window.URL.createObjectURL(file)

                        image.onload = () => {
                          this.setState({
                            file,
                            imageDimensions: {
                              width: image.naturalWidth,
                              height: image.naturalHeight
                            }
                          })
                          window.URL.revokeObjectURL(image.src)
                        }
                      }
                      else
                        this.setState({ file })
                    }
                  }
                />
              </label>

              <div className="mt-2 small">
                {t(`account-page.planches-page.planche-upload.drag-n-drop-tip`)}
              </div>

              {
                (file && this.getInvalidImageReason()) && (
                  <div className="text-warning mt-3">
                    { this.getInvalidImageReason() }
                  </div>
                )
              }

              {
                file && (
                  <div className="mt-3">
                    <Button
                      type="submit"
                      color="hbd"
                      disabled={!file || !!this.getInvalidImageReason()}
                    >
                      {t(`account-page.planches-page.planche-upload.submit`)}
                    </Button>
                  </div>
                )
              }
            </div>
          </Form>
        </div>
      </div>
    )
  }

}

class FrontValidationError extends Error {}

const withAddPage = withMutation(
  gql`
    mutation AddPage(
      $participationId: ID!
      $file: Upload!
      ) {
      addPage(
        participationId: $participationId
        file: $file
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
    addPage: (file) => mutate({
      variables: {
        participationId,
        file
      }
    })
  })
)

const withChallengeType = withQueryResult(
  gql`
    query ParticipationChallengeType($participationId: ID!) {
      participation(id: $participationId) {
        id
        challengeType
      }
    }
  `,
  {
    variables: ({ participationId }) => ({ participationId }),
    props: ({ participation }) => ({
      challengeType: participation.challengeType
    })
  }
)

const withDragAndDrop = (ChildComponent) =>
  props => {
    const { plancheUploadFormRef } = useContext(PageDragAndDropContext)
    return (
      <ChildComponent {...props} ref={plancheUploadFormRef} />
    )
  }

export default withChallengeType(withAddPage(withDragAndDrop(PlancheUploadForm)))