import * as types from '../constants/app'

const initialState = {
  isOnline: ''
}

export default (state = initialState, action) => {
  switch (action.type) {
    case types.SET_CONNECTION_STATUS:
      return {
        ...state,
        isOnline: action.connected
      }

    default:
      return state
  }
}
