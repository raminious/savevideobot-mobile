import React from 'react'
import { Icon, ListItem, Body, Left, Right, Text } from 'native-base'
import App from '../../../package.json'

export default ({

}) => (
  <ListItem icon>
    <Left>
      <Icon name="information-circle" />
    </Left>
    <Body>
      <Text note>Version</Text>
    </Body>
    <Right>
      <Text none>{App.version}</Text>
    </Right>
  </ListItem>
)
