/* global __DEV__ */
/* eslint no-console: "off"*/
/* eslint no-global-assign: "off"*/
import { AppRegistry } from 'react-native'

// import app bootstrap
import App from './App'

/*
 * Disable console functions on production mode
 *  to increase app performance
 */
if (!__DEV__) {
  console.disableYellowBox = true
  console = {}
  console.log = () => {}
  console.error = () => {}
  console.warn = () => {}
  window.console = console
}

AppRegistry.registerComponent('savevideobot', () => App)
