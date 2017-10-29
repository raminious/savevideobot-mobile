import { BackHandler, ToastAndroid } from 'react-native'

let exitTimer
let confirmExit = false

BackHandler.addEventListener('hardwareBackPress', () => {
  if (confirmExit === true) {
    clearTimeout(exitTimer)
    confirmExit = false
    return BackHandler.exitApp()
  }

  // confirm exit request
  confirmExit = true

  // show toast message
  ToastAndroid.show('Press back again to exit', ToastAndroid.SHORT)

  // if not confirmed for two seconds cancel confirmation
  exitTimer = setTimeout(() => {
    confirmExit = false
  }, 1000)

  return true
})
