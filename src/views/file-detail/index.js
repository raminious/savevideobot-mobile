import React from 'react'
import { withRouter } from 'react-router-native'
import { connect } from 'react-redux'
import {
  Grid,
  Row,
  Col,
  View,
  Button,
  Content,
  Card,
  CardItem,
  Body,
  Left,
  Right,
  Thumbnail,
  Icon,
  Text
} from 'native-base'
import { Image, Alert, ActivityIndicator } from 'react-native'
import RNFetchBlob from 'react-native-fetch-blob'
import mime from 'mime-types'
import moment from 'moment'
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
      media: null
    }
  }

  componentDidMount() {
    const { history, match } = this.props
    const { id } = match.params

    const media = this.findMedia(id)

    if (media.length !== 1) {
      return history.push('/files')
    }

    this.setState({
      media: media[0]
    })
  }

  findMedia(id) {
    return db
      .find('Media')
      .filtered(`id = '${id}'`)
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
  openFile() {
    const { media } = this.state

    const mimetype = mime.lookup(media.filename) || 'application/octet-stream'
    RNFetchBlob.android.actionViewIntent(media.filepath, mimetype)
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
  sendToTelegram() {
    const { history, account } = this.props
    const { media } = this.state
    SendToTelegram(history, account, media.url)
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
    .then(r => r).catch(e => e)

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

  render() {
    const { media, deleting } = this.state

    if (!media || deleting) {
      return <Loading
        text={deleting ? 'Deleting ...' : 'Loading ...'}
      />
    }

    return (
      <View style={styles.container}>
        <Header
          title={this.capitalize(media.type)}
          onGoBack={() => this.goBack()}
        />

        <View style={styles.container}>
          <Image
            style={styles.bg}
            source={ThumbnailService.loadImage(media)}
          />

          <Content>
            <Card style={styles.card}>
              <CardItem header>
                <Left>
                  <Thumbnail
                    source={ThumbnailService.loadImage(media)}
                  />

                  <Body>
                    <Text>{this.getTitle(media.title)}</Text>
                    <Text note>{this.capitalize(media.type)}</Text>
                  </Body>
                </Left>
              </CardItem>

              <CardItem>
                <View style={styles.container}>
                  <View style={styles.row}>
                    <Text style={styles.rowTitle}>Filename</Text>
                    <Text style={styles.rowDesc}>{media.filename}</Text>
                  </View>

                  <View style={styles.row}>
                    <Text style={styles.rowTitle}>Size</Text>
                    <Text style={styles.rowDesc}>{this.bytes(media.size)}</Text>
                  </View>

                  <View style={styles.row}>
                    <Text style={styles.rowTitle}>Date created</Text>
                    <Text style={styles.rowDesc}>{moment(media.date_created).format('Y/M/D HH:mm')}</Text>
                  </View>

                  <View style={styles.row}>
                    <Text style={styles.rowTitle}>Saved Path</Text>
                    <Text style={styles.rowDesc}>{media.filepath}</Text>
                  </View>
                </View>
              </CardItem>

              <CardItem footer>
                <Grid>
                  <Row>
                    <Col style={{ paddingRight: 3 }}>
                      <Button
                        small
                        iconLeft
                        bordered
                        info
                        full
                        onPress={() => this.openFile()}
                      >
                        <Icon name="open" />
                        <Text>Open {media.type}</Text>
                      </Button>
                    </Col>

                    <Col style={{ paddingLeft: 3 }}>
                      <Button
                        small
                        iconLeft
                        bordered
                        danger
                        full
                        onPress={() => this.requestDeleteFile()}
                      >
                        <Icon name="trash" />
                        <Text>Delete {media.type}</Text>
                      </Button>
                    </Col>
                  </Row>

                  <Row style={{ marginTop: 6 }}>
                    <Col>
                      <Button
                        small
                        full
                        iconLeft
                        bordered
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
              </CardItem>
           </Card>
          </Content>
        </View>
      </View>
    )
  }
}

function mapStateToProps({ account }) {
  return { account }
}

export default withRouter(connect(mapStateToProps)(FileDetailView))
