import * as types from '../constants/download'

export default (state = null, action) => {
  switch (action.type) {

    case types.SET_MEDIA:
      return action.media

    default:
      return state
  }
}
