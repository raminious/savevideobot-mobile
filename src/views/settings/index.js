import React from 'react'
import { withRouter } from 'react-router-native'
import { connect } from 'react-redux'
import { Share, Platform, StyleSheet, Alert, Linking } from 'react-native'
import { View, Text, Content, Icon, List, ListItem, Left, Right, Body, Switch } from 'native-base'
import { logout } from '../../actions/account'
import User from '../../api/user'
import Header from './header'
import EmailView from './email'
import SubscriptionView from './subscription'
import SavePathView from './save-path'
import AppVersionView from './app-version'
import TelegramView from './telegram'
import styles from './styles'

class SettingsView extends React.Component {
  constructor(props) {
    super(props)
  }

  onTelegramSetting() {
    const { account, history } = this.props

    if (account.telegram_id) {
      return false
    }

    history.push('/telegram/integration')
  }

  signoutRequest() {
    Alert.alert(
      'Logout',
      'Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Yes, Logout', onPress: () => this.sinout()}
      ]
    )
  }

  sinout() {
    const { account, logout } = this.props

    // remove user token
    User.signout(account.access_token)

    // logout user
    logout()
  }

  render() {
    const { account } = this.props

    return (
      <View style={styles.container}>
        <Header
          onRequestSignout={() => this.signoutRequest()}
        />

        <Content>
          <List>
            <ListItem itemDivider icon>
              <Body>
                <Text>System Information</Text>
              </Body>
            </ListItem>

            <SavePathView />

            <ListItem itemDivider icon>
              <Body>
                <Text>Account</Text>
              </Body>
            </ListItem>

            <EmailView
              account={account}
            />

            <SubscriptionView
              account={account}
            />

            <ListItem itemDivider icon>
              <Body>
                <Text>Integrations</Text>
              </Body>
            </ListItem>

            <TelegramView
              account={account}
              onTelegramSetting={() => this.onTelegramSetting()}
            />

            <ListItem itemDivider icon>
              <Body>
                <Text>Application</Text>
              </Body>
            </ListItem>

            <AppVersionView
              account={account}
            />

          </List>
        </Content>
      </View>
    )
  }
}

function mapStateToProps({ app, account }) {
  return { app, account }
}

export default withRouter(connect(mapStateToProps, { logout })(SettingsView))
