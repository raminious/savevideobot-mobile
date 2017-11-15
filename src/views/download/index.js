import React from 'React'
import { withRouter } from 'react-router-native'
import { connect } from 'react-redux'
import { Content, View, Toast, Button, Text, Icon, Col, Row, Grid } from 'native-base'
import { Platform, Image } from 'react-native'
import RNFetchBlob from 'react-native-fetch-blob'
import _ from 'underscore'
import Thumbnail from '../../services/thumbnail'
import DownloaderService from '../../services/downloader'
import db from '../../database'
import Media from '../../api/media'
import SendToTelegram from '../../services/telegram'
import Analytics from '../../services/analytics'
import Header from './header'
import MediaInfo from './media-info'
import Formats from './formats'
import CTA from './cta'
import styles from './styles'

class DownloadView extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      working: false,
      thumbnail: null,
      selectedFormat: this.getBestFormat()
    }
  }

  componentDidMount() {
    this.fetchThumbnail()
  }

  getBestFormat() {
    const { download } = this.props
    const { formats } = download

    if (formats.length === 0) {
      return 'best'
    }

    const find = formats.find(f => f.id === 18)
    return find ? 18 : formats[0].id
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
    const { history, account } = this.props
    let { site, url, download, extension, stream, size, type } = media
    const format = selectedFormat.toString()
    const user_id = account.id

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
      this.setState({ working: false })

      return Toast.show({
        text: 'Both direct and mirror links are not working at this time',
        position: 'top',
        duration: 6000
      })
    }

    /*
    * get destination path of download based on os
    */
    const baseDownloadPath = await DownloaderService.getDownloadPath()
    const filepath = `${baseDownloadPath}/${filename}`

    /*
    * check target is resumable or not
    */
    const resumable = await Media.supportsByteRange(downloadLink)

    // save media info in database
    db.save('Media', {
      id,
      user_id,
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

    // create analytics event
    Analytics.setEvent('Media', 'Download')

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

  sendToTelegram() {
    const { history, download, account } = this.props
    const { selectedFormat } = this.state
    SendToTelegram(history, account, `/${download.id}${selectedFormat}`)
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

        <Grid>
          <Row size={27}>
            <MediaInfo
              download={download}
            />
          </Row>

          <Row size={55}>
            <Formats
              formats={download.formats}
              selectedFormat={selectedFormat}
              onChangeFormat={(id) => this.onChangeFormat(id)}
            />
          </Row>

          <Row
            size={18}
            style={styles.ctaContainer}
          >
            <CTA
              working={working}
              startProcessing={() => this.startProcessing()}
              sendToTelegram={() => this.sendToTelegram()}
            />
          </Row>
        </Grid>
      </View>
    )
  }
}

function mapStateToProps({ account, download }) {
  return { account, download }
}

export default withRouter(connect(mapStateToProps)(DownloadView))
