import React from 'react'
import { Alert, TouchableOpacity } from 'react-native'
import { Icon, ListItem, Body, Left, Right, Text } from 'native-base'
import { withRouter } from 'react-router-native'
import { connect } from 'react-redux'
import { logout } from '../../actions/account'
import styles from './styles'

function signoutRequest(logout) {
  Alert.alert(
    'Logout',
    'Are you sure?',
    [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Yes, Logout', onPress: () => logout() }
    ]
  )
}

const SignoutView = ({
  account,
  logout
}) => (
  <ListItem icon>
    <Left>
      <Icon active name="log-out" />
    </Left>
    <Body>
      <Text note>
        {account.email}
      </Text>
    </Body>
    <Right>
      <TouchableOpacity onPress={() => signoutRequest(logout)}>
        <Text
          note
          style={{ fontWeight: 'bold' }}
        >
          Logout
        </Text>
      </TouchableOpacity>
    </Right>
  </ListItem>
)

export default withRouter(connect(null, { logout })(SignoutView))
