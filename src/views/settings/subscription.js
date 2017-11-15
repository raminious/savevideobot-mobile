import React from 'react'
import { Icon, ListItem, Body, Left, Right, Text } from 'native-base'
import { Alert, Linking } from 'react-native'
import moment from 'moment'
import config from '../../config'

function getRemainedDays(subscription) {
  return moment(subscription).fromNow(true)
}

function askForBuySubscription(userId) {
  Alert.alert(
    'Buy subscription',
    'Do you want to get more subscription?',
    [
      {text: 'Cancel', onPress: () => null, style: 'cancel'},
      {text: 'Yes', onPress: () => buySubscription(userId)}
    ],
    { cancelable: false }
  )
}

function buySubscription(userId) {
  Linking.openURL(`${config.app.domain}/subscription/buy/${userId}`)
}

export default ({
  account
}) => (
  <ListItem
    icon
    button
    onPress={() => askForBuySubscription(account.id)}
  >
    <Left>
      <Icon name="calendar" />
    </Left>
    <Body>
      <Text note>Remained days</Text>
    </Body>
    <Right>
      <Text note>
        {getRemainedDays(account.subscription)}
      </Text>
    </Right>
  </ListItem>
)
