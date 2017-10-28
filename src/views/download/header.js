import React from 'react'
import { TouchableOpacity } from 'react-native'
import { Header, Button, Text, Icon, Title, Left, Right, Body } from 'native-base'

export default ({
  onGoBack,
  onRequestDownload
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
      <Title>Download</Title>
    </Body>

    <Right icon>
      <TouchableOpacity
        onPress={onRequestDownload}
      >
        <Icon
          name="download"
          style={{ color: '#fff' }}
        />
      </TouchableOpacity>
    </Right>
  </Header>
)
