/* global __DEV__ */
import { Platform } from 'react-native'

// get dev server based on platform
const devServer = Platform.OS === 'ios' ? 'http://127.0.0.1:17000' : 'http://192.168.1.100:17000'

export default {
  sentry: {
    url: 'https://f8bb68c629594f3384371e7ac477cdf3:5c51692b13b647e189c825130cf348d7@sentry.io/240207'
  },
  api: {
    url: __DEV__ ? devServer : 'https://savevideobot.com/api'
  }
}
