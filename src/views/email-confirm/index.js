import React from 'react'
import { withRouter } from 'react-router-native'
import { connect } from 'react-redux'
import { Grid, Content, View, Form, Input, Toast, Item, Label,
  Button, Icon, Text } from 'native-base'
import { setUserAttributes, updateUserTable } from '../../actions/account'
import User from '../../api/user'
import Loading from '../../components/loading'
import styles from './styles'

class EmailConfirmView extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      verifyCode: '',
      validated: false,
      saving: false
    }
  }

  onVerifyCodeChange(verifyCode) {
    this.setState({
      verifyCode,
      validated: verifyCode.length >= 6
    })
  }

  async verifyEmail() {
    const { verifyCode } = this.state
    const { setUserAttributes, account, history } = this.props

    this.setState({ saving: true })

    try {
      await User.verifyEmail(account.id, verifyCode)

      Toast.show({
        text: 'Your email has been verified',
        position: 'bottom',
        duration: 2400
      })

      // update table
      updateUserTable({
        ...account,
        email_confirmed: true
      })

      // set user attr
      setUserAttributes({ email_confirmed: true })

      // navigate to setting page
      history.push('/settings')

    } catch(e) {
      Toast.show({
        text: e.response ? e.response.text : e.message,
        position: 'bottom',
        buttonText: 'Okay'
      })

      this.setState({ saving: false })
    }
  }

  render() {
    const { saving, verifyCode, validated } = this.state

    if (saving) {
      return (
        <Loading
          text="Checking verification code ..."
        />
      )
    }

    return (
      <Grid style={styles.container}>
        <Content contentContainerStyle={styles.container}>

          <View style={styles.iconContainer}>
            <Icon
              active
              name="at"
              style={{ fontSize: 140, color: '#eee' }}
            />
          </View>

          <View style={styles.formContainer}>
            <Form>
              <Item
                regular
                style={styles.inputVerifyCode}
              >
                <Input
                  placeholder="Enter Verification Code"
                  maxLength={6}
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
                  keyboardType="numeric"
                  value={verifyCode}
                  style={styles.verifyCode}
                  onChangeText={(text) => this.onVerifyCodeChange(text)}
                />
              </Item>

              <Button
                full
                style={styles.btnSubmit}
                disabled={!validated}
                onPress={() => this.verifyEmail()}
              >
                <Text>Verify Email</Text>
              </Button>
            </Form>
          </View>
        </Content>
      </Grid>
    )
  }
}

function mapStateToProps({ account }) {
  return { account }
}

export default withRouter(connect(mapStateToProps,
  { setUserAttributes })(EmailConfirmView))
