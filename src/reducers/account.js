import * as types from '../constants/account'

export default (state = {}, action) => {
  switch (action.type) {

    case types.LOGIN:
      return {
        ...action.identity,
        isLoggedIn: true
      }

    case types.LOGOUT:
      return {}

    default:
      return state
  }
}
