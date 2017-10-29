import * as types from '../constants/live'
import _ from 'underscore'

const initialState = {
  fetching: false,
  timeline: {}
}

function removeOldItems(list, max = 500) {
  let ctr = 1

  return _.pick(list, media => {
    if (media.expired || ctr > max) {
      return false
    }

    ctr++
    return media
  })
}

export default (state = initialState, action) => {
  switch (action.type) {

    case types.SET_TIMELINE_FETCHING:
      return {
        ...state,
        fetching: action.fetching
      }

    case types.SET_TIMELINE:
      return {
        fetching: false,
        timeline: removeOldItems({
          ..._.indexBy(action.timeline, 'id'),
          ...state.timeline
        })
      }

    default:
      return state
  }
}
