import React from 'react'
import { withRouter } from 'react-router-native'
import { connect } from 'react-redux'
import { TouchableOpacity } from 'react-native'
import { Share, Platform, StyleSheet, Alert, Linking } from 'react-native'
import { View, Input, Text, Content, Form, Button, Icon, Radio, Label,
  Item, ListItem, Right, Left, Body, Row, Col, Grid, Toast } from 'native-base'
import EmailValidator from 'email-validator'
import User from '../../api/user'
import Loading from '../../components/loading'
import AnimatedLogo from '../../components/animated-logo'
import Header from './header'
import styles from './styles'

class SettingsView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      working: false,
      email: '',
      sendCodeTo: 'email',
      emailValidated: false
    }
  }

  onChangeEmail(email) {
    this.setState({
      email: email.trim(),
      emailValidated: EmailValidator.validate(email.trim())
    })
  }

  onChangeSendTo(sendTo) {
    this.setState({
      sendCodeTo: sendTo
    })
  }

  getIconStyle() {
    const { emailValidated } = this.state

    return {
      color: emailValidated ? '#00C497' : 'gray',
      fontSize: 18,
      marginTop: 9
    }
  }

  async requestPin() {
    const { email, sendCodeTo } = this.state
    const { history } = this.props

    this.setState({ working: true })

    try {
      const { userId } = await User.forgetPassword(email, sendCodeTo)

      Toast.show({
        text: `Reset password pin has been sent to your ${sendCodeTo}`,
        position: 'bottom',
        duration: 2000
      })

      // navigate to reset page
      history.push(`/auth/password/reset/${userId}`)

    } catch(e) {
      Toast.show({
        text: e.response ? e.response.text : e.message,
        position: 'bottom',
        buttonText: 'Okay'
      })

      this.setState({ working: false })
    }
  }

  render() {
    const { email, emailValidated, sendCodeTo, working } = this.state

    if (working) {
      return (
        <Loading
          text="Please Wait..."
        />
      )
    }

    return (
      <Grid style={styles.container}>
        <Content contentContainerStyle={styles.container}>
          <AnimatedLogo />

          <View style={styles.formContainer}>

            <View>
              <Form>
                <Item floatingLabel>
                  <Icon
                    name={emailValidated ? 'checkmark-circle' : 'at'}
                    style={this.getIconStyle()}
                  />
                  <Label>Your email address</Label>
                  <Input
                    autoCapitalize="none"
                    keyboardType="email-address"
                    autoCorrect={false}
                    returnKeyType="next"
                    value={email}
                    onChangeText={(text) => this.onChangeEmail(text)}
                  />
                </Item>
              </Form>
            </View>

            <View style={styles.horizontalRow}>
              <Text note>Send reset pin to:</Text>
            </View>

            <View style={styles.horizontalRow}>
              <View>
                <Radio
                  style={styles.radioButton}
                  selected={sendCodeTo === 'email'}
                  onPress={() => this.onChangeSendTo('email')}
                />
              </View>

              <TouchableOpacity
                onPress={() => this.onChangeSendTo('email')}
              >
                <View size={90}>
                  <Text>Email</Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.horizontalRow}>
              <View>
                <Radio
                  style={styles.radioButton}
                  selected={sendCodeTo === 'telegram'}
                  onPress={() => this.onChangeSendTo('telegram')}
                />
              </View>

              <TouchableOpacity
                onPress={() => this.onChangeSendTo('telegram')}
              >
                <View size={90}>
                  <Text>Telegram</Text>
                </View>
              </TouchableOpacity>
            </View>

            <View>
              <Button
                full
                style={styles.btnSubmit}
                disabled={!emailValidated}
                onPress={() => this.requestPin()}
              >
                <Text>Send Reset Code</Text>
              </Button>
            </View>

          </View>
        </Content>
      </Grid>
    )
  }
}

export default SettingsView
