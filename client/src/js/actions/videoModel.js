import {
  VIDEO_PLAYBACK_MODEL_UPDATE,
  VIDEO_PLAYLIST_MODEL_UPDATE,
  VIDEO_PLAYLIST_MODEL_INCREMENT,
} from 'actions/actionTypes';

export function updatePlaybackModel(payload = {}) {
  return {
    type: VIDEO_PLAYBACK_MODEL_UPDATE,
    payload: payload,
  }
}

export function updatePlaylistModel(payload = {}) {
  return {
    type: VIDEO_PLAYLIST_MODEL_UPDATE,
    payload: payload,
  }
}

export function incrementPlaylistModel(payload = {}) {
  return {
    type: VIDEO_PLAYLIST_MODEL_INCREMENT,
    payload: payload,
  }
}
