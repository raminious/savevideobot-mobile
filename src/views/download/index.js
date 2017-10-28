import React from 'React'
import { withRouter } from 'react-router-native'
import { connect } from 'react-redux'
import { Content, View, Toast, Button, Text, Icon } from 'native-base'
import { Platform, Image } from 'react-native'
import RNFetchBlob from 'react-native-fetch-blob'
import Header from './header'
import MediaInfo from './media-info'
import Formats from './formats'
import Thumbnail from '../../services/thumbnail'
import DownloaderService from '../../services/downloader'
import db from '../../database'
import Media from '../../api/media'
import styles from './styles'

class DownloadView extends React.Component {
  constructor(props) {
    super(props)
    const { download } = props
    const { formats } = download

    this.state = {
      working: false,
      thumbnail: null,
      selectedFormat: formats.length > 0 ? formats[0].id : 'best'
    }
  }

  componentDidMount() {
    this.fetchThumbnail()
  }

  /*
   * go back to explore view
   */
  goBack() {
    const { history } = this.props

    this.setState({
      thumbnail: null,
      selectedFormat: null
    }, () => {
      history.goBack()
    })
  }

  /*
   * return download path based on platform
   */
  async getDownloadPath() {
    const dirs = RNFetchBlob.fs.dirs

    const basePath = Platform.select({
      ios: () => `${dirs.DocumentDir}/downloads`,
      android: () => `${dirs.DownloadDir}/savevideobot`,
    })()

    const isDir = await RNFetchBlob.fs.isDir(basePath)

    if (!isDir) {
      await RNFetchBlob.fs.mkdir(basePath)
    }

    return basePath
  }

  /*
   * fetch thumbnail information
   */
  async fetchThumbnail() {
    const { download } = this.props
    const thumbnail = await Thumbnail.getInfo(download)

    this.setState({ thumbnail })
  }

  /*
   * save thumbnail on disk and database
   */
  async saveThumbnail(id, prefix) {
    const { thumbnail } = this.state

    // save thumbnail on disk
    const file = await Thumbnail.saveOnDisk(id, thumbnail, prefix)

    if (!file || !file.id) {
      return false
    }

    db.save('Media', {
      id: file.id,
      thumbnail: file.path,
      date_modified: new Date()
    }, true)
  }

  /*
   * search media in database
   */
  searchMedia(url, format) {
    const search = db
      .find('Media')
      .filtered('url = $0 and format = $1', url, format)

    return (search.length === 1) ? search[0] : null
  }

  /*
   * check media is downloaded before or not
   */
  async isMediaDownloaded(media) {
    const isExists = await RNFetchBlob.fs.exists(media.filepath)
    return media.status === 'complete' && isExists === true
  }

  /*
   * check media is resumable or not
   */
  async getMediaStartByte(media) {
    let { resumable } = media
    let startByte = 0

    // recheck resumable if not supported
    if (resumable === false) {
      resumable = await Media.supportsByteRange(media.download_link)
    }

    if (resumable === true) {
      startByte = await Media.getStartByte(media.filepath)
    }

    // update record on database
    db.save('Media', {
      id: media.id,
      status: 'progress',
      resumable
    }, true)

    return startByte
  }

  /*
   * create a new clean download
   */
  async createNewDownload(id, media) {
    const { selectedFormat, thumbnail } = this.state
    const { history } = this.props
    let { site, url, download, extension, stream, size, type } = media
    const format = selectedFormat.toString()

    const title = media
      .title
      .replace(/[&/\\#,+()$~%.'":*?<>{}!]/g, '')

    let filename = `${site}_${title}.${extension}`
    const duration = ~~media.duration

    // get format of media
    if (media.formats.length > 0) {
      const fmt = _.find(media.formats, f => f.id.toString() === format)

      filename = `${site}_${format}_${title}.${fmt.ext}`
      extension = fmt.ext
      download = fmt.download
      stream = fmt.stream
      size = fmt.size
    }

    // replace special characters and spaces from filename
    filename = filename.replace(/\s+/ig, '_')

    const downloadLink = await this.findDownloadLink(download, stream)

    if (!downloadLink) {
      return Toast.show({
        text: 'Both direct and mirror links are not working at this time',
        position: 'bottom',
        buttonText: 'Okay'
      })
    }

    /*
    * get destination path of download based on os
    */
    const baseDownloadPath = await this.getDownloadPath()
    const filepath = `${baseDownloadPath}/${filename}`

    /*
    * check target is resumable or not
    */
    const resumable = await Media.supportsByteRange(downloadLink)

    // save media info in database
    db.save('Media', {
      id,
      site,
      url,
      title,
      extension,
      type,
      filename,
      filepath,
      format,
      resumable,
      duration,
      date_created: new Date(),
      status: 'progress',
      size: size || await Media.getSize(downloadLink),
      download_link: downloadLink
    })

    // save thumbnail
    await this.saveThumbnail(id, `${site}${title}${format}`)

    // start download file
    DownloaderService.createTask(id, downloadLink, filepath, resumable)

    history.push('/progress')
  }

  /**
   * check direct download link is available or not
   * use direct link is accessable, else use mirror link
   */
  async findDownloadLink(direct, stream) {
    for (let link of [direct, stream]) {
      if (await Media.canDirectDownload(link)) {
        return link
      }
    }

    return null
  }

  /*
   * start to download media
   */
  async process() {
    const { history } = this.props
    const { selectedFormat } = this.state
    const media = this.props.download
    const format = selectedFormat.toString()
    const id = media.id + format

    const find = this.searchMedia(media.url, format)

    if (find) {
      if (await this.isMediaDownloaded(find) === true) {
        return history.push(`/files/${find.id}`)
      } else {
        const startByte = await this.getMediaStartByte(find)
        DownloaderService.createTask(
          find.id,
          find.download_link,
          find.filepath,
          find.resumable,
          startByte
        )

        return history.push('/progress')
      }
    }

    return this.createNewDownload(id, media)
  }

  /*
   * start downloading media
   */
  startProcessing() {
    if (this.state.working) {
      return false
    }

    this.setState({
      working: true
    })

    this.process()
  }

  /*
   * change selected format
   */
  onChangeFormat(id) {
    const { working } = this.state

    if (working) {
      return false
    }

    this.setState({
      selectedFormat: id
    })
  }

  render() {
    const { download } = this.props
    const { working, thumbnail, selectedFormat } = this.state

    return (
      <View style={styles.container}>
        <Header
          onGoBack={() => this.goBack()}
          onRequestDownload={() => this.startProcessing()}
        />

        <MediaInfo
          thumbnail={thumbnail}
          download={download}
        />

        <Formats
          formats={download.formats}
          selectedFormat={selectedFormat}
          onChangeFormat={(id) => this.onChangeFormat(id)}
        />

        <View style={styles.downloadBtnContainer}>
          <Button
            iconLeft
            danger
            full
            rounded
            disabled={working}
            onPress={() => this.startProcessing()}
          >
            <Icon name="download" />
            <Text>{working ? 'Processing...' : 'Start Downloading'}</Text>
          </Button>
        </View>
      </View>
    )
  }
}

function mapStateToProps({ download }) {
  return { download }
}

export default withRouter(connect(mapStateToProps)(DownloadView))
