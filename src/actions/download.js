import * as types from '../constants/download'

export function setMedia(media) {
  return {
    type: types.SET_MEDIA,
    media
  }
}
