import * as types from '../constants/app'

export function setConnectionSataus(connected) {
  return {
    type: types.SET_CONNECTION_STATUS,
    connected
  }
}
