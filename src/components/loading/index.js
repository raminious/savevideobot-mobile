import React from 'react'
import { ActivityIndicator, StyleSheet } from 'react-native'
import { Content, View, Spinner, Text } from 'native-base'

export default ({
  show = true,
  text = 'Loading',
  spinnerColor = '#33425b',
  textColor = '#33425b',
  hideText = false
}) => {
  if (show === false) {
    return false
  }

  return (
    <Content
      contentContainerStyle={styles.container}
    >
      <ActivityIndicator
        color={spinnerColor}
        animating={true}
        hidesWhenStopped
        size="large"
      />

      {
        hideText !== true &&
        <Text
          style={{
            color: textColor,
            marginTop: 10
          }}
        >
          {text}
        </Text>
      }
    </Content>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
})
