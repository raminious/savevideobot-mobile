import React from 'react'
import { withRouter } from 'react-router-native'
import { connect } from 'react-redux'
import { Grid, Content, View, Form, Input, Toast, Item, Label,
  Button, Icon, Text } from 'native-base'
import User from '../../api/user'
import Loading from '../../components/loading'
import styles from './styles'

class ResetPasswordView extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      userId: props.match.params.userId,
      pinCode: '',
      password: '',
      confirmPassword: '',
      validation: {},
      saving: false
    }
  }

  onPinCodeChange(pinCode) {
    const { validation } = this.state
    validation.pinCode = pinCode.length >= 6

    this.setState({
      pinCode,
      validation
    })
  }

  onPasswordChange(password) {
    const { validation } = this.state

    password = password.trim() // eslint-disable-line no-param-reassign
    validation.password = password.length >= 6

    this.setState({
      password,
      validation
    })
  }

  onConfirmPasswordChange(confirmPassword) {
    const { validation } = this.state

    validation.confirmPassword = confirmPassword === this.state.password

    this.setState({
      confirmPassword,
      validation
    })
  }

  getIconStyle(type) {
    const { validation } = this.state

    return {
      color: validation[type] ? '#00C497' : 'gray',
      fontSize: 18,
      marginTop: 9
    }
  }

  async resetPassword() {
    const { userId, pinCode, password } = this.state

    const { history } = this.props

    this.setState({ saving: true })

    try {
      await User.resetPassword(userId, pinCode, password)
      Toast.show({
        text: 'Your password has been changed. Login with your new password.',
        position: 'top',
        duration: 2400
      })

      // navigate to reset page
      history.push('/auth/login')

    } catch(e) {
      Toast.show({
        text: e.response ? e.response.text : e.message,
        position: 'top',
        duration: 4000
      })

      this.setState({ saving: false })
    }
  }

  render() {
    const { saving, pinCode, password, confirmPassword, validation } = this.state

    if (saving) {
      return (
        <Loading
          text="Resetting Password ..."
        />
      )
    }

    return (
      <Grid style={styles.container}>
        <Content contentContainerStyle={styles.container}>
          <Form>
            <Item
              regular
              style={styles.inputPinCode}
            >
              <Input
                placeholder="Enter Pin Code"
                maxLength={6}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                keyboardType="numeric"
                value={pinCode}
                style={{ textAlign: 'center', fontSize: 22 }}
                onChangeText={(text) => this.onPinCodeChange(text)}
              />
            </Item>

            <Item floatingLabel>
              <Icon
                name={validation.password ? 'checkmark-circle' : 'lock'}
                style={this.getIconStyle('password')}
              />
              <Label>Enter your new password</Label>
              <Input
                disabled={!validation.pinCode}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                secureTextEntry={true}
                value={password}
                onChangeText={(text) => this.onPasswordChange(text)}
              />
            </Item>

            <Item floatingLabel>
              <Icon
                name={validation.confirmPassword ? 'checkmark-circle' : 'lock'}
                style={this.getIconStyle('confirmPassword')}
              />
              <Label>Confirm your new password</Label>
              <Input
                disabled={!validation.pinCode}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
                secureTextEntry={true}
                value={confirmPassword}
                onChangeText={(text) => this.onConfirmPasswordChange(text)}
              />
            </Item>

            <Button
              full
              style={styles.btnSubmit}
              disabled={!validation.pinCode || !validation.password || !validation.confirmPassword}
              onPress={() => this.resetPassword()}
            >
              <Text>Reset Password</Text>
            </Button>
          </Form>
        </Content>
      </Grid>
    )
  }
}

export default ResetPasswordView
