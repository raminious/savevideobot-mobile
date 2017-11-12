import React from 'react'
import { TouchableOpacity } from 'react-native'
import { Header, Title, Left, Right, Icon, Body } from 'native-base'

export default ({
  onRequestSignout
}) => (
  <Header>
    <Body>
      <Title>Settings</Title>
    </Body>

    <Right icon>
      <TouchableOpacity onPress={onRequestSignout}>
        <Icon
          name="log-out"
          style={{ color: '#fff' }}
        />
      </TouchableOpacity>
    </Right>
  </Header>
)
