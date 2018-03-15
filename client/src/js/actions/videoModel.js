import {
  VIDEO_PLAYBACK_MODEL_UPDATE,
  VIDEO_PLAYLIST_MODEL_UPDATE,
  VIDEO_PLAYLIST_MODEL_INCREMENT,
  VIDEO_VIDEO_ID_SET,
} from 'actions/actionTypes';

export function setVideoId(payload = {}) {
  return {
    type: VIDEO_VIDEO_ID_SET,
    payload: payload,
  }
}

export function updatePlaybackModel(payload = {}) {
  return {
    type: VIDEO_PLAYBACK_MODEL_UPDATE,
    payload: payload,
  }
}

/*************
    change the video id by videoIndex
*************/
export function updatePlaylistModel(payload = {}) {
  return {
    type: VIDEO_PLAYLIST_MODEL_UPDATE,
    payload: payload,
  }
}

/*************
    changes the reference
*************/
export function incrementPlaylistModel(payload = {}) {
  return {
    type: VIDEO_PLAYLIST_MODEL_INCREMENT,
    payload: payload,
  }
}
