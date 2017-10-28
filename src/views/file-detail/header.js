import React from 'react'
import { Header, Button, Text, Icon, Title, Left, Right, Body } from 'native-base'

export default ({
  title = 'Downloads',
  onGoBack
}) => (
  <Header>
    <Left>
      <Button
        transparent
        onPress={onGoBack}
      >
        <Icon name="arrow-back" />
      </Button>
    </Left>

    <Body>
      <Title>{title}</Title>
    </Body>

    <Right />
  </Header>
)
