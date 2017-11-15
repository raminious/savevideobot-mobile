import React from 'react'
import { TouchableOpacity, ActivityIndicator } from 'react-native'
import { Header, Title, Body, Right, Text } from 'native-base'

export default ({
  isChecking,
  isWaitingForIntegration,
  onCancelChecking
}) => (
  <Header>
    <Body>
      <Title>Telegram Connect</Title>
    </Body>

    <Right>
      <ActivityIndicator
        color='#fff'
        animating={isChecking}
        hidesWhenStopped
        size="small"
      />

      {
        isWaitingForIntegration && !isChecking &&
        <TouchableOpacity onPress={onCancelChecking}>
          <Text style={{ color: '#fff' }}>Cancel</Text>
        </TouchableOpacity>
      }
    </Right>
  </Header>
)
