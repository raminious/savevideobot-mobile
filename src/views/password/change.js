import React from 'react'
import { withRouter } from 'react-router-native'
import { connect } from 'react-redux'
import { Grid, Content, View, Form, Input, Toast, Item, Label,
  Button, Icon, Text } from 'native-base'
import User from '../../api/user'
import Loading from '../../components/loading'
import styles from './styles'

class ChangePasswordView extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
      validation: {},
      saving: false
    }
  }

  onCurrentPasswordChange(currentPassword) {
    const { validation } = this.state

    currentPassword = currentPassword.trim() // eslint-disable-line no-param-reassign
    validation.currentPassword = currentPassword.length >= 6

    this.setState({
      currentPassword,
      validation
    })
  }

  onNewPasswordChange(newPassword) {
    const { validation } = this.state

    newPassword = newPassword.trim() // eslint-disable-line no-param-reassign
    validation.newPassword = newPassword.length >= 6

    this.setState({
      newPassword,
      validation
    })
  }

  onConfirmNewPasswordChange(confirmNewPassword) {
    const { validation } = this.state

    validation.confirmNewPassword = confirmNewPassword === this.state.newPassword

    this.setState({
      confirmNewPassword,
      validation
    })
  }

  isFormValid() {
    const { validation } = this.state

    return validation.currentPassword &&
      validation.newPassword &&
      validation.confirmNewPassword
  }

  async changePassword() {
    const { pinCode, currentPassword, newPassword } = this.state
    const { history } = this.props

    this.setState({ saving: true })

    try {
      await User.changePassword(currentPassword, newPassword)
      Toast.show({
        text: 'Your password has been changed.',
        position: 'top',
        duration: 3500
      })

      // navigate to reset page
      history.push('/settings')

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
    const { saving, currentPassword, newPassword, confirmNewPassword, validation } = this.state

    if (saving) {
      return (
        <Loading
          text="Changing Password ..."
        />
      )
    }

    return (
      <Grid>
        <Content contentContainerStyle={styles.container}>

          <View style={styles.iconContainer}>
            <Icon
              active
              name="lock"
              style={{ fontSize: 140, color: '#eee' }}
            />
          </View>

          <View style={styles.formContainer}>
            <Form>
              <Item floatingLabel>
                <Label>Your current password</Label>
                <Input
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="done"
                  secureTextEntry={true}
                  value={currentPassword}
                  onChangeText={(text) => this.onCurrentPasswordChange(text)}
                />
              </Item>

              <Item floatingLabel>
                <Label>Enter your new password</Label>
                <Input
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
                  secureTextEntry={true}
                  value={newPassword}
                  onChangeText={(text) => this.onNewPasswordChange(text)}
                />
              </Item>

              <Item floatingLabel>
                <Label>Confirm your new password</Label>
                <Input
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="done"
                  secureTextEntry={true}
                  value={confirmNewPassword}
                  onChangeText={(text) => this.onConfirmNewPasswordChange(text)}
                />
              </Item>

              <Button
                full
                style={styles.btnSubmit}
                disabled={!this.isFormValid()}
                onPress={() => this.changePassword()}
              >
                <Text>Change Password</Text>
              </Button>
            </Form>
          </View>
        </Content>
      </Grid>
    )
  }
}

export default ChangePasswordView
