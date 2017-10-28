import * as types from '../constants/progress'

export function addProgress(id, filename) {
  return {
    type: types.ADD_PROGRESS,
    id,
    filename
  }
}

export function updateProgress(id, data) {
  return {
    type: types.UPDATE_PROGRESS,
    id,
    data
  }
}

export function removeProgress(id) {
  return {
    type: types.REMOVE_PROGRESS,
    id
  }
}
