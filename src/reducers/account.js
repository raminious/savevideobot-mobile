import * as types from '../constants/account'

export default (state = {}, action) => {
  switch (action.type) {

    case types.SET_USER:
      return {
        ...action.identity,
        isLoggedIn: true
      }

    case types.SET_USER_ATTRIBUTES:
      return {
        ...state,
        ...action.attributes
      }

    case types.LOGOUT:
      return {}

    default:
      return state
  }
}
