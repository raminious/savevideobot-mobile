import React from 'react'
import { TouchableOpacity, ActivityIndicator } from 'react-native'
import { Header, Title, Body, Right, Text } from 'native-base'

export default ({
  isChecking
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
    </Right>
  </Header>
)
