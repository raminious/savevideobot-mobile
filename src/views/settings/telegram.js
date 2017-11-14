import React from 'react'
import { TouchableOpacity } from 'react-native'
import { Icon, ListItem, Body, Left, Right, Text } from 'native-base'

export default ({
  onTelegramSetting,
  account
}) => (
  <ListItem
    button
    icon
    onPress={onTelegramSetting}
  >
    <Left>
      <Icon name="ios-send" />
    </Left>
    <Body>
      <Text note>Telegram</Text>
    </Body>
    <Right>
      {
        account.telegram_id ?
        <Icon
          name="checkmark"
          style={{ color: 'green' }}
        /> :
        <TouchableOpacity onPress={onTelegramSetting}>
          <Icon name="cog" />
        </TouchableOpacity>
      }
    </Right>
  </ListItem>
)
