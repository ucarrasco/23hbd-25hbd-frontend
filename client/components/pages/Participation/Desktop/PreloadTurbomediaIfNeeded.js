import React from 'react'

class PreloadTurbomediaIfNeeded extends React.Component {

  constructor(props) {
    super(props)
    const { participation } = props
    this.state = {
      allGood: !(participation.pages.length && participation.challengeType == 'turbomedia')
    }
  }

  componentDidMount() {
    const { isOpen } = this.props
    this._isMounted = true
    if (isOpen && !this.state.allGood)
      this.preloadImages()
  }

  componentDidUpdate(prevProps) {
    const { isOpen } = this.props
    const { isOpen: wasOpen } = prevProps
    if (isOpen && !wasOpen && !this.state.allGood)
      this.preloadImages()
  }

  preloadImages = () => {
    const { participation } = this.props
    Promise.all(
      participation.pages.map(
        page =>
          new Promise(
            resolve => {
              const img = new Image()
              img.onload = () => {
                resolve()
              }
              img.onerror = error => {
                return Promise.resolve()
              }
              img.src = page.url
            }
          )
      )
    ).then(
      () => {
        if (this._isMounted)
          this.setState({ allGood: true })
      }
    )
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  render() {
    const { children } = this.props
    // return this.state.allGood ? children : null
    // screw this, images will load while we read the first page
    return children
  }
}

export default PreloadTurbomediaIfNeeded
