import React from 'react'
import { withRouter } from 'react-router-native'
import { connect } from 'react-redux'
import { Content, View, Form, Input, Toast, Item, Label, Button, Icon, Text } from 'native-base'
import * as Animatable from 'react-native-animatable'
import EmailValidator from 'email-validator'
import { login } from '../../actions/account'
import User from '../../api/user'
import db from '../../database'
import Loading from '../../components/loading'
import styles from './styles'

class SignupView extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      name: '',
      email: '',
      password: '',
      saving: false,
      validation: {
        name: false,
        email: false,
        password: false
      }
    }
  }

  onNameChange(name) {
    const { validation } = this.state

    name = name.trim() // eslint-disable-line no-param-reassign

    validation.name = name.length >= 3

    this.setState({
      name,
      validation
    })
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

  goToLoginPage() {
    const { history } = this.props
    history.push('/auth/login')
  }

  getIconStyle(type) {
    const { validation } = this.state

    return {
      color: validation[type] ? '#00C497' : 'gray',
      fontSize: 18,
      marginTop: 9
    }
  }

  async submit() {
    const { name, email, password, validation } = this.state
    const { login, history } = this.props

    if (validation.name === false) {
      return Toast.show({
        text: 'Enter your name',
        position: 'bottom',
        buttonText: 'Okay'
      })
    }

    if (validation.email === false) {
      return Toast.show({
        text: 'Enter a valid email address',
        position: 'bottom',
        buttonText: 'Okay'
      })
    }

    if (validation.password === false) {
      return Toast.show({
        text: 'Password must be at least 6 characters',
        position: 'bottom',
        buttonText: 'Okay'
      })
    }

    // hold identity object
    let identity = null

    this.setState({
      saving: true
    })

    try {
      identity = await User.signup(name, email, password)
    } catch (e) {
      this.setState({ saving: false })

      if (e) {
        return Toast.show({
          text: e.response ? e.response.text : e.message,
          position: 'bottom',
          buttonText: 'Okay'
        })
      }
    }

    db.save('User', {
      name: identity.name,
      username: identity.username || '',
      email: identity.email,
      access_token: identity.token,
      date_modified: new Date(),
    }, true)

    // save identity on redux
    login(User.getIdentity())

    // show message
    Toast.show({
      text: 'Welcome to Save Video Bot',
      position: 'top',
      buttonText: 'Okay'
    })

    history.push('/')
  }

  render() {
    const { validation, saving, name, email, password } = this.state

    return (
      <View style={styles.container}>
        <Loading
          show={saving}
          text="Creating account ..."
        />

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

          <View style={styles.formContainer}>
            <Form>
              <Item floatingLabel>
                <Icon
                  name={validation.name ? 'checkmark-circle' : 'contact'}
                  style={this.getIconStyle('name')}
                />
                <Label>Your name</Label>
                <Input
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
                  value={name}
                  onChangeText={(text) => this.onNameChange(text)}
                />
              </Item>

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
                <Label>Type a secure password</Label>
                <Input
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="done"
                  value={password}
                  onChangeText={(text) => this.onPasswordChange(text)}
                />
              </Item>

              <Button
                full
                style={styles.signup}
                onPress={() => this.submit()}
              >
                <Text>Signup</Text>
              </Button>

              <Button
                full
                transparent
                style={styles.cancel}
                onPress={() => this.goToLoginPage()}
              >
                <Text style={styles.cancelText}>
                  I already have an account
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

export default withRouter(connect(mapStateToProps, { login })(SignupView))
