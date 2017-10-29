import React from 'react'
import { Image, Text } from 'react-native'
import ThumbnailService from '../../services/thumbnail'

const loadingImage = require('../../assets/icons/loading.gif')
const notFoundImage = require('../../assets/icons/no-image.png')

export default class AsyncImage extends React.Component {
  constructor(props) {
    super(props)
    this.mounted = true

    this.state = {
      loading: true,
      source: loadingImage
    }
  }

  componentDidMount() {
    this.getThumbnailUrl()
  }

  componentWillUnmount() {
    this.mounted = false
  }

  async getThumbnailUrl() {
    const { media } = this.props
    const thumbnail = await ThumbnailService.getInfo(media)

    if (media.type === 'image') {
      return this.setState({
        source: {uri: media.download}
      })
    }

    let newSource = notFoundImage

    if (thumbnail) {
      if (thumbnail.isDefault) {
        newSource = thumbnail.path
      } else {
        newSource = {uri: thumbnail.url}
      }
    }

    if (!this.mounted) {
      return false
    }

    this.setState({
      source: newSource
    })
  }

  render() {
    const { style } = this.props
    const { source } = this.state

    return (
      <Image
        style={style}
        source={source}
      />
    )
  }
}
