import * as types from '../constants/app'

const initialState = {
  isOnline: '',
  state: 'active'
}

export default (state = initialState, action) => {
  switch (action.type) {
    case types.SET_CONNECTION_STATUS:
      return {
        ...state,
        isOnline: action.connected
      }

    case types.SET_APP_STATE:
      return {
        ...state,
        state: action.state
      }

    default:
      return state
  }
}
