/* eslint no-param-reassign: "off" */
import _ from 'underscore'
import * as types from '../constants/progress'

export default (state = {}, action) => {
  switch (action.type) {

    case types.ADD_PROGRESS:
      return {
        ...state,
        [action.id]: {
          filename: action.filename,
          received: 0,
          total: 0,
        }
      }

    case types.UPDATE_PROGRESS:
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          ...action.data
        }
      }

    case types.REMOVE_PROGRESS:
      return _.omit(state, (s, i) => i === action.id) /* eslint no-unused-vars: "off" */

    default:
      return state
  }
}
