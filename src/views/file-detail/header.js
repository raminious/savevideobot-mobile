import React from 'react'
import { Header, Button, Text, Icon, Title, Left, Right, Body } from 'native-base'
import { TouchableOpacity } from 'react-native'

export default ({
  title = 'Downloads',
  onGoBack,
  onToggleShowCard
}) => (
  <Header>
    <Left>
      <TouchableOpacity onPress={onGoBack}>
        <Icon
          name="arrow-back"
          style={{ color: '#fff' }}
        />
      </TouchableOpacity>
    </Left>

    <Body>
      <Title>{title}</Title>
    </Body>

    <Right>
      <TouchableOpacity onPress={onToggleShowCard}>
        <Icon
          name="images"
          style={{ color: '#fff' }}
        />
      </TouchableOpacity>
    </Right>
  </Header>
)
