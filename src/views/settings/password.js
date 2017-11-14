import React from 'react'
import { TouchableOpacity } from 'react-native'
import { Icon, ListItem, Body, Left, Right, Text } from 'native-base'

export default ({
  account,
  history
}) => (
  <ListItem
    button
    icon
  >
    <Left>
      <Icon name="lock" />
    </Left>
    <Body>
      <Text note>Password</Text>
    </Body>
    <Right>
      <TouchableOpacity onPress={() => history.push('/settings/password/change')}>
        <Text note>Change Password</Text>
      </TouchableOpacity>
    </Right>
  </ListItem>
)
