import React from 'react'
import { withRouter } from 'react-router-native'
import { connect } from 'react-redux'
import { View, Toast, Content, Item, Icon, Input, Button, Text } from 'native-base'
import { Share, Image } from 'react-native'
import User from '../../api/user'
import { sendLocalNotification } from '../../services/notification'
import { setUserAttributes, updateUserTable } from '../../actions/account'
import styles from './styles'
import Header from './header'

class TelegramIntegrationView extends React.Component {
  constructor(props) {
    super(props)
    this.checkedCount = 0

    this.state = {
      isChecking: false,
      waitingForIntegration: false,
      showManualInstruction: false
    }
  }

  onClickIntegrate() {
    const { account } = this.props

    Share.share({
      message: `/link_${account.id}`,
      url: 'tg://resolve?domain=savevideobot',
      title: 'Telegram Integrating'
    }, {
      dialogTitle: 'Connect SaveVideoBot To Telegram',
    })

    this.setState({
      waitingForIntegration: true
    })

    setTimeout(() => this.checkIntegration(), 5000)
  }

  toggleHelpMore() {
    this.setState({
      showManualInstruction: !this.state.showManualInstruction
    })
  }

  async checkIntegration(persist = true) {
    if (this.state.isChecking) {
      return false
    }

    if (persist && this.checkedCount >= 4) {
      return this.onFailedIntegration()
    }

    try {
      // set counter
      this.checkedCount += 1

      // set state
      this.setState({ isChecking: true })

      // set checking
      const user = await User.getInfo()

      // set state
      this.setState({ isChecking: false })

      if (user.telegram_id) {
        return this.onConnected(user)
      } else if (!persist && !user.telegram_id) {
        return this.onFailedIntegration()
      }

      setTimeout(() => this.checkIntegration(), 5000)
    } catch(e) {
      this.setState({ isChecking: true })
    }
  }

  onConnected(user) {
    const { history, setUserAttributes } = this.props

    // update table
    updateUserTable(user)

    // set user attr
    setUserAttributes({ telegram_id: user.telegram_id })

    Toast.show({
      text: 'Your Telegram account has been integrated',
      position: 'bottom',
      duration: 3000
    })

    history.goBack()
  }

  onFailedIntegration() {
    this.checkedCount = 0

    this.setState({
      waitingForIntegration: false
    })

    Toast.show({
      text: 'Your account not integrated yet. try again.',
      position: 'bottom',
      duration: 5000
    })
  }

  render() {
    const { account } = this.props
    const { isChecking, showManualInstruction, waitingForIntegration } = this.state

    return (
      <View style={styles.container}>
        <Header
          isChecking={isChecking}
        />

        <Content>
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/logo/telegram.png')}
              style={{ marginBottom: 15, width: 100, height: 100 }}
            />
          </View>

          <View style={styles.description}>
            <Text style={styles.descriptionText}>
              Your account is not connected to your telegram account.
              To connect your account:
            </Text>

            <Text style={styles.li}>1- Click on below button</Text>
            <Text style={styles.li}>2- Select Telegram messenger</Text>
            <Text style={styles.li}>3- Select @savevideobot</Text>

            <Button
              iconLeft
              primary
              medium
              full
              disabled={waitingForIntegration}
              style={styles.btnIntegrate}
              onPress={() => this.onClickIntegrate()}
            >
              <Icon name="ios-send" />
              <Text>{waitingForIntegration ? 'Waiting for response...' : 'Start Integrating'}</Text>
            </Button>

            <Button
              primary
              transparent
              full
              onPress={() => this.toggleHelpMore()}
            >
              <Text>I have problem</Text>
            </Button>
          </View>

          {
            showManualInstruction &&
            <View style={styles.descriptionManual}>
              <Text note>
                If above instruction didn't work, copy this text
                manually and send to @savevideobot in Telegram
              </Text>

              <Item
                regular
                style={styles.inputManual}
              >
                <Input value={`/link_${account.id}`} />
              </Item>

              <Button
                dark
                small
                full
                disabled={waitingForIntegration}
                style={styles.btnCheckManually}
                onPress={() => this.checkIntegration(false)}
              >
                <Text>{waitingForIntegration ? 'Waiting for response...' : 'Check manually'}</Text>
              </Button>
            </View>
          }
        </Content>
      </View>
    )
  }
}

function mapStateToProps({ app, account }) {
  return { app, account }
}

export default withRouter(connect(mapStateToProps, { setUserAttributes })(TelegramIntegrationView))
