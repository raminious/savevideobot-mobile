import React from 'react'
import { Alert, TouchableOpacity } from 'react-native'
import { Icon, Toast, ListItem, Body, Left, Right, Text } from 'native-base'
import { withRouter } from 'react-router-native'
import { connect } from 'react-redux'
import User from '../../api/user'
import styles from './styles'

class EmailView extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      sendingEmail: false
    }
  }

  componentDidMount() {

  }

  requestEmailConfirm() {
    Alert.alert(
      'Confirm Email',
      'Confirm your email and receive 7 more days free subscription',
      [
        { text: 'Later', style: 'cancel' },
        { text: 'Yes, Send email', onPress: () => this.sendConfirmationCode() }
      ]
    )
  }

  async sendConfirmationCode() {
    const { history } = this.props
    this.setState({ sendingEmail: true })

    try {
      await User.sendConfirmationEmail()

      Toast.show({
        text: 'Verification code has been sent to your email. check your inbox.',
        position: 'bottom',
        duration: 4000
      })

      return history.push('/settings/email/confirm')
    } catch(e) {

      Toast.show({
        text: e.response ? e.response.text : e.message,
        position: 'bottom',
        duration: 4000
      })

      this.setState({ sendingEmail: false })
    }
  }

  render() {
    const { account } = this.props
    const { sendingEmail } = this.state

    return (
      <ListItem icon>
        <Left>
          <Icon active name="at" />
        </Left>
        <Body>
          <Text note>
            {account.email}
          </Text>
        </Body>
        {
          sendingEmail ?
          <Right>
            <Text note>Sending email</Text>
          </Right> :
          <Right>
            {
              account.email_confirmed ?
              <Icon
                name="checkmark"
                style={{ color: 'green' }}
              /> :
              <TouchableOpacity
                onPress={() => this.requestEmailConfirm()}>
                <Text
                  note
                  style={{ color: 'red', fontWeight: 'bold' }}
                >
                  Verify email
                </Text>
              </TouchableOpacity>
            }
          </Right>
        }
      </ListItem>
    )
  }
}

function mapStateToProps({ app, account }) {
  return { app, account }
}

export default withRouter(connect(null, { })(EmailView))
