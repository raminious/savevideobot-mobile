/* global __DEV__ */
import { Platform } from 'react-native'

// get dev server based on platform
const devServer = Platform.OS === 'ios' ? 'http://127.0.0.1:17000' : 'http://192.168.1.100:17000'

export default {
  api: {
    url: __DEV__ ? devServer : 'https://savevideobot.com/api'
  }
}
