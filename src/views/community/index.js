import React from 'react'
import { withRouter } from 'react-router-native'
import { connect } from 'react-redux'
import { View, ListItem, Left, Right, Icon, Body, Text, Button } from 'native-base'
import { Image, RefreshControl, ActivityIndicator } from 'react-native'
import { ListView } from 'realm/react-native'
import _ from 'underscore'
import moment from 'moment'
import 'moment-duration-format'
import { setMedia } from '../../actions/download'
import { fetchLiveTimeline } from '../../actions/live'
import Media from '../../api/media'
import AsyncImage from '../../components/async-image'
import Header from './header'
import styles from './styles'

let fetchTimer = null

class CommunityView extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      ds: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
    }
  }

  componentDidMount() {
    const { live } = this.props

    if (_.size(live.timeline) === 0) {
      return this.fetchTimeline()
    }

    this.setTimer()
  }

  componentWillUnmount() {
    clearTimeout(fetchTimer)
  }

  async fetchTimeline() {
    const { fetchLiveTimeline } = this.props

    await fetchLiveTimeline()

    this.setTimer()
  }

  handleRefreshController() {
    clearTimeout(fetchTimer)
    this.fetchTimeline()
  }

  onSelectRow(media) {
    const { setMedia, history } = this.props

    // save media information in redux
    setMedia(Media.normalize(media))

    history.push('/download')
  }

  getButtonCaption(extension) {
    const label = `Explore ${Media.getTypeByExtension(extension)}`
    return label.toUpperCase()
  }

  setTimer() {
    fetchTimer = setTimeout(() => {
      this.fetchTimeline()
    }, 20000)
  }

  render() {
    const { ds } = this.state
    const { live } = this.props

    return (
      <View style={styles.container}>
        <Header />

        <ListView
          dataSource={ds.cloneWithRows(live.timeline)}
          refreshControl={
            <RefreshControl
              refreshing={live.fetching}
              onRefresh={() => this.handleRefreshController()}
            />
          }
          enableEmptySections
          renderRow={item => (
            <ListItem
              button
              onPress={() => this.onSelectRow(item)}
            >
              <Left style={styles.imageContainer}>
                <AsyncImage
                  style={styles.thumbnail}
                  media={item}
                />
              </Left>

              <Body style={{ flex: 6.5 }}>
                <Text style={styles.title}>
                  {item.title}
                </Text>

                <Text style={styles.info}>
                  {item.site} | {item.extension}

                  {
                    item.duration &&
                    ' | ' +
                    moment.duration(~~item.duration, 'seconds')
                    .format('h:mm:ss[s]', { forceLength: true })
                  }
                </Text>


                <Text style={styles.btnView}>
                  {this.getButtonCaption(item.extension)}&nbsp;
                  <Icon name="arrow-forward" style={styles.btnViewIcon} />
                </Text>
              </Body>

              <Right />

            </ListItem>
          )}
        />
      </View>
    )
  }
}

function mapStateToProps({ app, live }) {
  return { app, live }
}

export default withRouter(connect(mapStateToProps,
  { setMedia, fetchLiveTimeline })(CommunityView))
