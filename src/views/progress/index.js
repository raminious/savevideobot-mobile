import React from 'react'
import { withRouter } from 'react-router-native'
import { connect } from 'react-redux'
import { Bar } from 'react-native-progress'
import {
  Content,
  List,
  ListItem,
  Header,
  Body,
  Title,
  View,
  Toast,
  Button,
  Text,
  Icon,
  Left,
  Right
} from 'native-base'
import { Alert, Dimensions } from 'react-native'
import _ from 'underscore'
import moment from 'moment'
import 'moment-duration-format'
import DownloaderService from '../../services/downloader'
import EmptyState from './empty-state'
import ProgressCTA from './cta'
import styles from './styles'
const { width } = Dimensions.get('window')

const colors = ['#016FB9', '#22AED1', '#6D8EA0', '#AFA98D', '#035BBD']

class ProgressView extends React.Component {
  constructor(props) {
    super(props)
  }

  getTitle(title = '', max = 20) {
    return title.length <= max ?
      title :
      title.substr(0, max - 5).trim() + '...' + title.substr(-10).trim()
  }

  onClearTask(taskId) {
    DownloaderService.clearTask(taskId)
  }

  onRemoveTask(taskId) {
    DownloaderService.removeTask(taskId)
  }

  onOpenMedia(taskId) {
    const { history } = this.props

    // clear task in progress on opening
    this.onClearTask(taskId)

    history.push(`/files/${taskId}`)
  }

  requestStopTask(taskId) {
    Alert.alert(
      `Stop downloading`,
      'Are you sure to stop downloading this file ?',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Yes, Stop', onPress: () => this.onStopTask(taskId)},
      ]
    )
  }

  onStopTask(taskId) {
    DownloaderService.stopTask(taskId)
  }

  onResumeTask(taskId) {
    DownloaderService.resumeTask(taskId)
  }

  onClickListItem(item, id) {
    if (item.done) {
      this.onOpenMedia(id)
    }
  }

  /*
   * Convert bytes to human readable size
   */
  bytes(bytes) {
    const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB']

    if (bytes === 0) {
      return '0 Byte'
    }

    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10)

    // eslint-disable-next-line no-restricted-properties
    return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i]
  }

  render() {
    const { progress } = this.props

    if (_.size(progress) === 0) {
      return <EmptyState />
    }

    return (
      <Content style={styles.container}>
        <Header>
          <Body>
            <Title>Download Manager</Title>
          </Body>
        </Header>

        <List>
          {
            _.map(progress, (item, id) => {
              const percent = ~~item.total > 0 ? (item.received / item.total) : 0
              const duration = ((new Date()).getTime() - item.start_time) / 1000
              const bits = ~~item.received - item.start_byte
              const speed = (bits / duration) / 1024
              const eta = ((item.total - item.received) * duration) / bits

              return (
                <View key={id}>
                  <ListItem
                    itemDivider
                    icon
                  >
                    <Body>
                      <Text>{this.getTitle(item.filename)}</Text>
                    </Body>

                    <Right>
                      <Icon
                        name={/savevideobot/.test(item.link) ? 'cloud-download' : 'cloud'}
                        style={{ fontSize: 25 }}
                      />
                    </Right>
                  </ListItem>

                  <ListItem
                    style={styles.widerList}
                    icon
                    button
                    onPress={() => this.onClickListItem(item, id)}
                  >
                    <Body style={styles.widerList}>
                      <View>
                        <Bar
                          color={colors[Math.floor((percent * 100) % 4)]}
                          indeterminate={percent === 0 && item.active}
                          progress={item.done ? 1 : percent}
                          width={width / 2}
                          borderRadius={0}
                          height={17}
                        />
                      </View>

                      <View>
                        {
                          item.error &&
                          <Text style={[styles.percent, styles.red]}>
                            {item.error}
                          </Text>
                        }

                        {
                          item.done &&
                          <Text style={[styles.percent, styles.green]}>
                            Download is completed
                          </Text>
                        }

                        {
                          percent > 0 && item.active &&
                          <Text style={styles.percent}>
                            { (percent * 100).toFixed(2) }% of { this.bytes(item.total) }

                            {
                              item.active && speed >= 0 &&
                              <Text style={styles.percent}>
                                &nbsp;at {speed.toFixed(2)}KiB/s
                                &nbsp;eta { moment.duration(~~eta, 'seconds').format('h:mm:ss[s]', { forceLength: true }) }
                              </Text>
                            }
                          </Text>
                        }

                        {
                          percent === 0 && item.active &&
                          <Text style={styles.percent}>
                            Waiting for server response
                          </Text>
                        }
                      </View>
                    </Body>

                    <ProgressCTA
                      task={item}
                      taskId={id}
                      onClearTask={(taskId) => this.onClearTask(taskId)}
                      onRemoveTask={(taskId) => this.onRemoveTask(taskId)}
                      onOpenMedia={(taskId) => this.onOpenMedia(taskId)}
                      onStopTask={(taskId) => this.requestStopTask(taskId)}
                      onResumeTask={(taskId) => this.onResumeTask(taskId)}
                    />
                  </ListItem>
                </View>
              )
            })
          }
        </List>
      </Content>
    )
  }
}

function mapStateToProps({ progress }) {
  return { progress }
}

export default withRouter(connect(mapStateToProps)(ProgressView))
