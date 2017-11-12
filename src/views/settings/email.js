import React from 'react'
import { Alert, TouchableOpacity } from 'react-native'
import { Icon, ListItem, Body, Left, Right, Text } from 'native-base'
import { withRouter } from 'react-router-native'
import { connect } from 'react-redux'
import { User } from '../../api/user'
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
      'Confirm your email and receive 10 more days free subscription',
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
      await User.sendConfirmationLink()

      Toast.show({
        text: 'Confirmation pin code has been sent. check your inbox.',
        position: 'bottom',
        duration: 4000
      })

      return history.push('/settings/email-confirm')
    } catch(e) {
      Toast.show({
        text: e.response ? e.response.text : e.message,
        position: 'bottom',
        buttonText: 'Okay'
      })

      this.setState({ sendingEmail: true })
    }
  }

  render() {
    const { account } = this.props

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
        <Right>
          {
            account.email_confirmed ?
            <Text note>Confirmed</Text> :
            <TouchableOpacity
              onPress={() => this.requestEmailConfirm()}>
              <Text
                note
                style={{ color: 'red', fontWeight: 'bold' }}
              >
                Confirm
              </Text>
            </TouchableOpacity>
          }
        </Right>
      </ListItem>
    )
  }
}

function mapStateToProps({ app, account }) {
  return { app, account }
}

export default withRouter(connect(null, { })(EmailView))
