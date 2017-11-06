import React from 'react'
import { Icon, ListItem, Body, Left, Right, Text } from 'native-base'

export default ({
  account
}) => (
  <ListItem icon>
    <Left>
      <Icon name="ios-send" />
    </Left>
    <Body>
      <Text note>Telegram</Text>
    </Body>
    <Right>
      {
        account.telegram_id ?
        <Text none>Connected</Text> :
        <Text none>NO</Text>
      }
    </Right>
  </ListItem>
)
