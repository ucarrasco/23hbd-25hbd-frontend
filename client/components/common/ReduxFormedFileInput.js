import React from 'react'

class ReduxFormedFileInput extends React.Component {

  constructor(props) {
    super(props)
    this.inputFileRef = React.createRef()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.input.value && !this.props.input.value)
      this.inputFileRef.current.value = ""
  }

  render() {
    const {
      input: { onChange, value },
      meta: { dirty, error },
      showErrors,
      getImageDimensions,
      wrapper,
    ...otherProps
    } = this.props

    const inputNode = (
      <input
        type="file"
        ref={this.inputFileRef}
        {...otherProps}
        onChange={
          e => {
            const input = e.target
            const file = input.files[0]
            if (!file)
              onChange(null)
            else {
              const fileInfo = {
                fileType: file.type,
                file
              }
              if (getImageDimensions && file.type.match(/^image\//)) {
                const image = new Image()
                image.src = window.URL.createObjectURL(file)

                image.onload = () => {
                  window.URL.revokeObjectURL(image.src)
                  onChange({
                    ...fileInfo,
                    imageDimensions: {
                      width: image.naturalWidth,
                      height: image.naturalHeight
                    }
                  })
                }
                image.onerror = () => {
                  window.URL.revokeObjectURL(image.src)
                  onChange(null)
                }
              }
              else
                onChange(fileInfo)
            }
          }
        }
      />
    )

    return (
      showErrors
        ? (
          <div {...wrapper}>
            { inputNode }
            {
              (dirty && error) && (
                <div className="text-danger">{error}</div>
              )
            }
          </div>
        )
        : inputNode
    )
  }
}

export default ReduxFormedFileInput
