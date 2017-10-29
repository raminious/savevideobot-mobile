import React from 'react'
import { withRouter } from 'react-router-native'
import { connect } from 'react-redux'
import { Content, View, Button, Icon, Text } from 'native-base'
import * as Animatable from 'react-native-animatable'
import styles from './styles'

class IntroView extends React.Component {
  constructor(props) {
    super(props)
  }

  register() {
    const { history } = this.props
    history.push('/auth/signup')
  }

  login() {
    const { history } = this.props
    history.push('/auth/login')
  }

  render() {
    return (
      <View style={styles.container}>
        <Content contentContainerStyle={styles.container}>

          <View style={styles.logoContainer}>
            <Animatable.Image
              animation="pulse"
              iterationCount="infinite"
              duration={2000}
              // eslint-disable-next-line global-require
              source={require('../../assets/logo/savevideobot-76x76.png')}
              style={{ marginBottom: 30 }}
            />
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.title}>
              Downloading never was easier than now
            </Text>

            <Text style={styles.subtitle}>
            Download your favorite videos, musics and documents from Dailymotion,
            Facebook, Instagram, Soundcloud and tens of other video sharing web sites</Text>
          </View>

          <View style={styles.btnContainer}>
            <View style={{ flexDirection: 'row' }}>
              <Button
                onPress={() => this.register()}
                style={[styles.button, styles.signup]}
                iconLeft
              >
                <Icon name="body" />
                <Text>Create an account</Text>
              </Button>

              <Button
                info
                iconLeft
                onPress={() => this.login()}
                style={[styles.button]}
              >
                <Icon name="log-in" />
                <Text>Sign in</Text>
              </Button>
            </View>
          </View>
        </Content>
      </View>
    )
  }
}

function mapStateToProps({ app }) {
  return { app }
}

export default withRouter(connect(mapStateToProps)(IntroView))
