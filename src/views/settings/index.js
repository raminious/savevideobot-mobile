import React from 'react'
import { withRouter } from 'react-router-native'
import { connect } from 'react-redux'
import { Platform, StyleSheet, Alert, Linking } from 'react-native'
import { View, Text, Content, Icon, List, ListItem, Left, Right, Body, Switch } from 'native-base'
import RNFetchBlob from 'react-native-fetch-blob'
import _ from 'underscore'
import { logout } from '../../actions/account'
import App from '../../../package.json'
import Header from './header'
import styles from './styles'

class SettingsView extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    _.each(RNFetchBlob.fs.dirs, (path, id) =>
      console.log(id, path)
    )

  }

  signoutRequest() {
    Alert.alert(
      'Logout',
      'Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Yes, Logout', onPress: () => this.signout() }
      ]
    )
  }

  signout() {
    const { logout } = this.props
    logout()
  }

  render() {
    const { account } = this.props

    return (
      <View style={styles.container}>
        <Header />

        <Content>
          <List>
            <ListItem itemDivider icon>
              <Body>
                <Text>System Information</Text>
              </Body>
            </ListItem>

            <ListItem icon>
              <Left>
                <Icon name="cloud-download" />
              </Left>
              <Body>
                <Text>Files path</Text>
              </Body>
              <Right>
                <Text note>
                  { _.find(RNFetchBlob.fs.dirs, (path, id) => id === 'DownloadDir')}
                  /savevideobot
                </Text>
              </Right>
            </ListItem>

            <ListItem itemDivider icon>
              <Body>
                <Text>Account</Text>
              </Body>
            </ListItem>

            <ListItem icon>
              <Left>
                <Icon name="contacts" />
              </Left>
              <Body>
                <Text>{account.email}</Text>
              </Body>
              <Right>
                <Text
                  note
                  onPress={() => this.signoutRequest()}
                  style={{ fontWeight: 'bold' }}
                >
                  Logout
                </Text>
              </Right>
            </ListItem>

            <ListItem icon>
              <Left>
                <Icon name="contacts" />
              </Left>
              <Body>
                <Text>Subscription</Text>
              </Body>
              <Right>

              </Right>
            </ListItem>

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
