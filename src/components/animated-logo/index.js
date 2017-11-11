import React from 'react'
import { View } from 'native-base'
import * as Animatable from 'react-native-animatable'

export default ({
  flexSize
}) => (
  <View style={{
    flex: flexSize || 3,
    alignItems: 'center',
    justifyContent: 'center'
  }}>
    <Animatable.Image
      animation="pulse"
      iterationCount="infinite"
      duration={2000}
      // eslint-disable-next-line global-require
      source={require('../../assets/logo/savevideobot-76x76.png')}
      style={{ marginBottom: 30 }}
    />
  </View>
)
