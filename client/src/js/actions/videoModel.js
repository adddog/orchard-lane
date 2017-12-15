import {
  VIDEO_PLAYBACK_UPDATE,
} from 'actions/actionTypes';

export function updatePlaybackModel(payload = {}) {
  return {
    type: VIDEO_PLAYBACK_UPDATE,
    payload: payload,
  }
}
