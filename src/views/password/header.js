import React from 'react'
import { TouchableOpacity } from 'react-native'
import { Header, Title, Left, Right, Body } from 'native-base'

export default ({
  title
}) => (
  <Header>
    <Body>
      <Title>{title}</Title>
    </Body>
  </Header>
)
