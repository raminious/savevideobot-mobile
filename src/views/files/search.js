import React from 'react'
import { Header, Item, Input, Icon } from 'native-base'

export default ({
  onSearch,
  onClose
}) => (
  <Header
    searchBar={true}
    rounded={true}
  >
    <Item>
      <Input
        placeholder="Search"
        onChangeText={onSearch}
      />
      <Icon
        name="close-circle"
        onPress={onClose}
      />
    </Item>
  </Header>
)
