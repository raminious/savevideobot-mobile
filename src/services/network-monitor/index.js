import { NetInfo, ToastAndroid } from 'react-native'
import { setConnectionSataus } from '../../actions/app'
import store from '../../store'

NetInfo.isConnected.fetch().done((connected) => {
  // set app connection status
  store.dispatch(setConnectionSataus(connected))
})

// add event listener
NetInfo.addEventListener('connectionChange', onConnectionChange)

function onConnectionChange(connected) {
  const { app } = store.getState()
  const isConnected = (connected !== null)

  // set app connection status
  if (app.isOnline !== isConnected) {
    store.dispatch(setConnectionSataus(isConnected))
  }

  if (!isConnected) {
    ToastAndroid('Check your internet connection')
  }
}
