import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-native'
import { Image, Keyboard } from 'react-native'
import { View, Toast, Item, Text, Content, InputGroup, Input, Label, Icon, Button } from 'native-base'
import * as Animatable from 'react-native-animatable'
import Loading from '../../components/loading'
import { setMedia } from '../../actions/download'
import Media from '../../api/media'
import styles from './styles'

const urlPattern = /(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi

class ExploreView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      searching: false,
      url: 'https://www.youtube.com/watch?v=DUT5rEU6pqM',
      isValidated: true
    }
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
    const { url, isValidated } = this.state
    const { history, setMedia } = this.props

    if (!isValidated){
      return Toast.show({
        text: 'Enter a valid link',
        position: 'bottom',
        buttonText: 'Okay'
      })
    }

    this.setState({
      searching: true
    })

    Keyboard.dismiss()

    try {
      const media = await Media.request(url)
      const downloadInformation = await Media.dump(media.id)

      // save media information in redux
      setMedia(downloadInformation)

      this.setState({ searching: false }, () => {
        history.push('/download')
      })

    } catch(e) {
      console.log(e.message)
      console.log(e.response)
      this.setState({ searching: false })
    }
  }

  render() {
    const { url, searching, isValidated } = this.state

    if (searching) {
      return (
        <Loading text="Searching..." />
      )
    }

    return (
      <Content contentContainerStyle={styles.container}>
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
            rounded
            onPress={() => this.explore()}
          >
            <Text>Search Link</Text>
          </Button>
        </View>
      </Content>
    )
  }
}


function mapStateToProps({ app }) {
  return { app }
}

export default withRouter(connect(mapStateToProps, { setMedia })(ExploreView))