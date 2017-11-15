import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-native'
import { Image, Keyboard } from 'react-native'
import { View, Toast, Item, Text, Content, InputGroup, Input, Label, Icon, Button } from 'native-base'
import * as Animatable from 'react-native-animatable'
import Loading from '../../components/loading'
import Analytics from '../../services/analytics'
import { setMedia } from '../../actions/download'
import { setSharedLink } from '../../actions/app'
import Media from '../../api/media'
import styles from './styles'

const urlPattern = /(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi

class ExploreView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      searching: false,
      url: '',
      isValidated: false
    }
  }

  componentDidMount() {
    const { app } = this.props
    this.checkForSharedLink(app)
  }

  componentWillReceiveProps(nextProps) {
    const { app } = nextProps
    this.checkForSharedLink(app)
  }

  checkForSharedLink({ sharedLink }) {
    const { searching } = this.state

    if (searching || !sharedLink || !urlPattern.test(sharedLink)) {
      return false
    }

    this.setState({
      url: sharedLink,
      isValidated: true
    }, () => this.explore())

    this.props.setSharedLink(null)
  }

  onUrlChange(url) {
    this.setState({
      url,
      isValidated: urlPattern.test(url)
    })
  }

  /**
  * send request for explore url to server
  */
  async explore() {
    const { url } = this.state
    const { history, setMedia } = this.props

    this.setState({
      searching: true
    })

    Keyboard.dismiss()

    try {
      // set event
      Analytics.setEvent('Media', 'Explore')

      const media = await Media.request(url)
      const downloadInformation = await Media.dump(media.id)

      // save media information in redux
      setMedia(downloadInformation)

      this.setState({ searching: false }, () => {
        history.push('/download')
      })

    } catch(e) {
      let errorText = 'Could not complete your request'

      if (e.response) {
        if (e.response.status === 401) {
          return false
        }

        errorText = e.response.text

        // set error event
        Analytics.setEvent('Error', 'Explore')
      }

      Toast.show({
        text: errorText,
        position: 'top',
        duration: 2500
      })

      this.setState({ searching: false })
    }
  }

  render() {
    const { url, searching, isValidated } = this.state

    if (searching) {
      return (
        <Loading text="Getting Link Information..." />
      )
    }

    return (
      <View style={styles.container}>
        <Content contentContainerStyle={styles.contentWrapper}>
          <View style={styles.row}>
            <Animatable.View
              animation="pulse"
              iterationCount="infinite"
              duration={2000}
            >
              <Icon
                active
                name="cloud-download"
                style={{
                  fontSize: 140,
                  color: '#ccc'
                }}
              />
            </Animatable.View>
          </View>

          <View style={styles.row}>
            <Item style={styles.urlContainer}>
              <Icon
                active
                name={isValidated ? 'checkmark-circle' : 'link'}
                style={{
                  color: isValidated ? '#00C497' : '#33425b',
                  fontSize: 20
                }}
              />

              <Input
                autoCapitalize="none"
                style={{ fontSize: 13 }}
                placeholderTextColor="#33425b"
                placeholder="Paste video url here to download"
                value={url}
                onChangeText={(url) => this.onUrlChange(url)}
              />
            </Item>
          </View>

          <View
            style={[styles.row, styles.mt20]}
          >
            <Button
              info
              onPress={() => this.explore()}
            >
              <Text>Search Link</Text>
            </Button>
          </View>
        </Content>
      </View>
    )
  }
}


function mapStateToProps({ app }) {
  return { app }
}

export default withRouter(connect(mapStateToProps, { setMedia, setSharedLink })(ExploreView))
