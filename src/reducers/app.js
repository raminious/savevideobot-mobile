import * as types from '../constants/app'

const initialState = {
  isOnline: '',
  state: '',
  sharedLink: null
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

    case types.SET_SHARED_LINK:
      return {
        ...state,
        sharedLink: action.link
      }

    default:
      return state
  }
}
