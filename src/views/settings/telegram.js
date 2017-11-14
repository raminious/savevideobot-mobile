import React from 'react'
import { TouchableOpacity } from 'react-native'
import { Icon, ListItem, Body, Left, Right, Text } from 'native-base'

function onTelegramSetting(account, history) {
  if (account.telegram_id) {
    return false
  }

  history.push('/settings/telegram/integration')
}

export default ({
  history,
  account
}) => (
  <ListItem
    button
    icon
    onPress={() => onTelegramSetting(account, history)}
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
        <TouchableOpacity
          onPress={() => onTelegramSetting(account, history)}
        >
          <Icon name="cog" />
        </TouchableOpacity>
      }
    </Right>
  </ListItem>
)
