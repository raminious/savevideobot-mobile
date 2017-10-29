import * as types from '../constants/live'
import Community from '../api/community'

function setIsFetching(fetching) {
  return {
    type: types.SET_TIMELINE_FETCHING,
    fetching
  }
}

function setTimeline(timeline) {
  return {
    type: types.SET_TIMELINE,
    timeline
  }
}

export function fetchLiveTimeline() {
  return async (dispatch) => {
    // set timeline is fetching
    dispatch(setIsFetching(true))

    // get latest timeline
    const timeline = await Community.live()
    dispatch(setTimeline(timeline))
  }
}
