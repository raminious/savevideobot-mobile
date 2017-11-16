import React from 'react'
import { withRouter } from 'react-router-native'
import { connect } from 'react-redux'
import { Grid, Row, Col, View, Button, Content, Card, CardItem, Body,
  Left, Right, Thumbnail, Icon, Text
} from 'native-base'
import GestureRecognizer from 'react-native-swipe-gestures'
import { Image, Alert, ActivityIndicator } from 'react-native'
import RNFetchBlob from 'react-native-fetch-blob'
import mime from 'mime-types'
import moment from 'moment'
import _ from 'underscore'
import db from '../../database'
import ThumbnailService from '../../services/thumbnail'
import SendToTelegram from '../../services/telegram'
import Loading from '../../components/loading'
import Header from './header'
import styles from './styles'

class FileDetailView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      deleting: false,
      showCard: true,
      fileExists: false,
      media: null
    }
  }

  componentDidMount() {
    this.load()
  }

  async load() {
    const { history, match } = this.props
    const { id } = match.params

    const media = this.findMedia(id)

    if (media.length !== 1) {
      return history.push('/files')
    }

    const fileExists = await this.getFileExists(media[0].filepath)

    this.setState({
      media: media[0],
      fileExists
    })
  }

  findMedia(id) {
    const { account } = this.props

    return db
      .find('Media')
      .filtered(`id = '${id}' && user_id = '${account.id}'`)
  }

  getTitle(title = '', max = 20) {
    return title.length <= max ?
      title :
      title.substr(0, max - 5).trim() + '...' + title.substr(-10).trim()
  }

  capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
  }

  goBack() {
    const { history } = this.props
    history.goBack()
  }

  /*
   * Convert bytes to human readable size
   */
  bytes(bytes){
    if (bytes === 0) {
      return '0 Byte'
    }

    // eslint-disable-next-line no-restricted-properties
    return `${(bytes / Math.pow(1024, 2)).toFixed(2)} MB`
  }

  /**
   *
   */
  async openFile() {
    const { media, fileExists } = this.state

    if (!fileExists) {
      return alert('Cannot open this file because it has been moved or removed')
    }

    const mimetype = mime.lookup(media.filename) || 'application/octet-stream'
    RNFetchBlob.android.actionViewIntent(media.filepath, mimetype)
  }

  /**
   *
   */
  getFileExists(filepath) {
    return new Promise(resolve => {
      RNFetchBlob.fs.exists(filepath)
      .then((exist) => resolve(exist))
      .catch(() => resolve(false))
    })
  }

  /**
   *
   */
  requestDeleteFile() {
    const { media } = this.state

    Alert.alert(
      `Delete ${media.title}`,
      'Are you sure to delete this file ?',
      [
        {text: 'Cancel', onPress: () => null, style: 'cancel'},
        {text: 'Yes, Delete', onPress: () => this.deleteFile()},
      ],
      { cancelable: false }
    )
  }

  /**
   *
   */
  async deleteFile() {
    const { media } = this.state

    this.setState({
      deleting: true
    })

    // remove file
    RNFetchBlob.fs.unlink(media.filepath)
    .then(r => r)
    .catch(e => e)

    // remove thumbnail
    if (media.thumbnail) {
      RNFetchBlob.fs.unlink(`${await ThumbnailService.getBasePath()}/${media.thumbnail}`)
      .then(r => r).catch(e => e)
    }

    // remove from db
    const remove = this.findMedia(media.id)
    db.remove(remove)

    this.goBack()
  }

  /**
   *
   */
  sendToTelegram() {
    const { history, account } = this.props
    const { media } = this.state
    SendToTelegram(history, account, media.url)
  }

  onToggleShowCard() {
    this.setState({
      showCard: !this.state.showCard
    })
  }

  onSwipeRight(state) {
    this.goBack()
  }

  render() {
    const { media, showCard, fileExists, deleting } = this.state

    if (!media || deleting) {
      return <Loading
        text={deleting ? 'Deleting ...' : 'Loading ...'}
      />
    }

    const table = {
      'Filename': media.filename,
      'Size': this.bytes(media.size),
      'Download time': moment(media.date_created).format('Y/M/D HH:mm'),
      'Saved Path': media.filepath
    }

    return (
      <View style={styles.container}>
        <Header
          title={this.capitalize(media.type)}
          onGoBack={() => this.goBack()}
          onToggleShowCard={() => this.onToggleShowCard()}
        />

        <GestureRecognizer
          onSwipeRight={(state) => this.onSwipeRight(state)}
          style={styles.container}
        >
          <View style={styles.container}>
            <Image
              style={styles.bg}
              source={ThumbnailService.loadImage(media)}
            />

            {
              showCard &&
              <Content>
                <Grid style={[styles.card, styles.headerCard]}>
                  <Row>
                    <Col size={20}>
                      <Thumbnail
                        source={ThumbnailService.loadImage(media)}
                      />
                    </Col>

                    <Col size={80}>
                      <Text>{this.getTitle(media.title)}</Text>
                      <Text note>{this.capitalize(media.type)}</Text>
                    </Col>
                  </Row>
                </Grid>

                <Grid style={[styles.card, styles.middleCard]}>
                  {
                    _.map(table, (value, name) =>
                      <Row
                        key={`FIELD_${name}`}
                        style={styles.fieldRow}
                      >
                        <Col>
                          <Text note>{name}</Text>
                          <Text style={styles.fieldValue}>{value}</Text>
                        </Col>
                      </Row>
                    )
                  }
                </Grid>

                <Grid style={[styles.card, styles.footerCard]}>
                  <Row>
                    <Col style={{ paddingRight: 5 }}>
                      <Button
                        small
                        iconLeft
                        info
                        full
                        onPress={() => this.openFile()}
                      >
                        <Icon name="open" />
                        <Text>Open {media.type}</Text>
                      </Button>
                    </Col>

                    <Col style={{ paddingLeft: 5 }}>
                      <Button
                        small
                        iconLeft
                        danger
                        full
                        onPress={() => this.requestDeleteFile()}
                      >
                        <Icon name="trash" />
                        <Text>Delete {media.type}</Text>
                      </Button>
                    </Col>
                  </Row>

                  <Row style={{ marginTop: 10 }}>
                    <Col>
                      <Button
                        small
                        full
                        iconLeft
                        dark
                        style={styles.btnCta}
                        onPress={() => this.sendToTelegram()}
                      >
                        <Icon name="send" />
                        <Text>Send file to my Telegram</Text>
                      </Button>
                    </Col>
                  </Row>
                </Grid>

              </Content>
            }
          </View>
        </GestureRecognizer>
      </View>
    )
  }
}

function mapStateToProps({ account }) {
  return { account }
}

export default withRouter(connect(mapStateToProps)(FileDetailView))
