import React, { useCallback, useRef } from 'react'
import styled from 'styled-components'
import { useDropzone } from 'react-dropzone'
import PageDragAndDropContext from './PageDragAndDropContext'


const PageDragAndDropContainer = ({ children, disabled = false }) => {
  const plancheUploadFormRef = useRef()
  const onDrop = useCallback(acceptedFiles => {
    if (plancheUploadFormRef && plancheUploadFormRef.current)
      plancheUploadFormRef.current.dropFiles(acceptedFiles)
  }, [])
  const { getRootProps, isDragActive } = useDropzone({ onDrop, disabled })
  return (
      <DropZoneBorder className={isDragActive ? "dragging" : ""} {...getRootProps()} tabIndex={undefined}>
        <div>
          <PageDragAndDropContext.Provider value={{ plancheUploadFormRef }}>
            { children }
          </PageDragAndDropContext.Provider>
        </div>
      </DropZoneBorder>
  )
}

const DropZoneBorder = styled.div`
  border: dashed 10px transparent;
  border-radius: 20px;

  /* transition: border-color 0.1s ease-in;
  > * {
    transition: opacity 0.1s ease-in;
  } */

  &.dragging {
    border-color: #f17ea9;
    > * {
      opacity: 0.15;
    }
  }
`

export default PageDragAndDropContainer
