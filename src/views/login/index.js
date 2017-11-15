import React from 'react'
import { withRouter } from 'react-router-native'
import { connect } from 'react-redux'
import { Alert } from 'react-native'
import { Content, View, Form, Input, Toast, Item, Label, Button, Icon, Text } from 'native-base'
import EmailValidator from 'email-validator'
import { setUser, updateUserTable } from '../../actions/account'
import AnimatedLogo from '../../components/animated-logo'
import User from '../../api/user'
import Loading from '../../components/loading'
import styles from './styles'

class LoginView extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      email: '',
      password: '',
      working: false,
      validation: {
        email: false,
        password: false
      }
    }
  }

  onEmailChange(email) {
    const { validation } = this.state

    email = email.trim() // eslint-disable-line no-param-reassign
    validation.email = EmailValidator.validate(email)

    this.setState({
      email,
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

  goToSignupPage() {
    const { history } = this.props
    history.push('/auth/signup')
  }

  goToForgetPasswordPage() {
    const { history } = this.props
    history.push('/auth/password/forget')
  }

  getIconStyle(type) {
    const { validation } = this.state

    return {
      color: validation[type] ? '#00C497' : 'gray',
      fontSize: 18,
      marginTop: 9
    }
  }

  async submit(terminateOtherSessions = false) {
    const { email, password, validation } = this.state
    const { setUser, history } = this.props

    if (validation.email === false) {
      return Toast.show({
        text: 'Enter a valid email address',
        position: 'bottom',
        duration: 3000
      })
    }

    if (validation.password === false) {
      return Toast.show({
        text: 'Password is not correct',
        position: 'bottom',
        duration: 3000
      })
    }

    // hold user identity
    let user

    // display modal
    this.setState({ working: true })

    try {
      user = await User.signin(email, password, terminateOtherSessions)
    } catch (e) {
      this.setState({ working: false })

      if (e.response && e.response.status === 403) {
        return this.requestRemoveOtherSessions()
      }

      return Toast.show({
        text: e.response ? e.response.text : e.message,
        position: 'bottom',
        duration: 4000
      })
    }


    // update database with new data
    updateUserTable(user)

    // save user on redux
    setUser(user)

    // push to explore view
    history.push('/')
  }

  requestRemoveOtherSessions() {
    Alert.alert(
      'To many sessions',
      'You have logged in with too many devices. ' +
        'Do you want to terminate them all and login into your account ?',
      [
        {text: 'Cancel', onPress: () => null, style: 'cancel'},
        {text: 'Yes, Continue', onPress: () => this.submit(true)},
      ],
      { cancelable: false }
    )
  }

  render() {
    const { validation, working, email, password } = this.state

    if (working) {
      return (
        <Loading
          text="Signing in ..."
        />
      )
    }

    return (
      <View style={styles.container}>
        <Content contentContainerStyle={styles.container}>
          <AnimatedLogo />

          <View style={styles.formContainer}>
            <Form>
              <Item floatingLabel>
                <Icon
                  name={validation.email ? 'checkmark-circle' : 'at'}
                  style={this.getIconStyle('email')}
                />
                <Label>Your email address</Label>
                <Input
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoCorrect={false}
                  returnKeyType="next"
                  value={email}
                  onChangeText={(text) => this.onEmailChange(text)}
                />
              </Item>

              <Item floatingLabel>
                <Icon
                  name={validation.password ? 'checkmark-circle' : 'lock'}
                  style={this.getIconStyle('password')}
                />
                <Label>Your password</Label>
                <Input
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="done"
                  secureTextEntry={true}
                  value={password}
                  onChangeText={(text) => this.onPasswordChange(text)}
                />
              </Item>

              <Button
                full
                style={styles.login}
                onPress={() => this.submit()}
              >
                <Text>Login</Text>
              </Button>

              <Button
                full
                primary
                small
                transparent
                style={styles.forgetPassword}
                onPress={() => this.goToForgetPasswordPage()}
              >
                <Text>
                  Forget your password?
                </Text>
              </Button>

              <Button
                full
                transparent
                small
                style={styles.cancel}
                onPress={() => this.goToSignupPage()}
              >
                <Text note>
                  I Don't have an account
                </Text>
              </Button>
            </Form>
          </View>
        </Content>
      </View>
    )
  }
}

function mapStateToProps({ app }) {
  return { app }
}

export default withRouter(connect(mapStateToProps, { setUser })(LoginView))
