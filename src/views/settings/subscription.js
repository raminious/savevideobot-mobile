import React from 'react'
import { Icon, ListItem, Body, Left, Right, Text } from 'native-base'
import { Alert } from 'react-native'
import { buySubscription } from '../../actions/account'
import moment from 'moment'

function getRemainedDays(subscription) {
  const date = moment(subscription)

  if (moment().isAfter(date)) {
    return <Text note style={{ color: 'red' }}>Expired</Text>
  }

  return (
    <Text note>
      { date.fromNow(true) }
    </Text>
  )
}

function askForBuySubscription(userId) {
  Alert.alert(
    'Buy subscription',
    'Do you want to renew or get more subscription days?',
    [
      {text: 'Cancel', onPress: () => null, style: 'cancel'},
      {text: 'Yes', onPress: () => buySubscription(userId)}
    ],
    { cancelable: false }
  )
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
      { getRemainedDays(account.subscription) }
    </Right>
  </ListItem>
)
