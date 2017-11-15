import React from 'react'
import { Header, View, Text, Body, Title, Icon } from 'native-base'
import styles from './styles'

export default () => (
  <View style={styles.container}>
    <Header>
      <Body>
        <Title>Download Manager</Title>
      </Body>
    </Header>

    <View style={[styles.container, styles.center]}>
      <Icon
        name="cloud-download"
        style={[styles.iconNoJob, styles.transparent]}
      />
      <Text style={[styles.transparent, styles.textNoJob]}>
        There is no active download
      </Text>
    </View>
  </View>
)
