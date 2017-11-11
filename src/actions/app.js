import * as types from '../constants/app'

export function setConnectionSataus(connected) {
  return {
    type: types.SET_CONNECTION_STATUS,
    connected
  }
}

export function setAppState(state) {
  return {
    type: types.SET_APP_STATE,
    state
  }
}

export function setSharedLink(link) {
  return {
    type: types.SET_SHARED_LINK,
    link
  }
}
