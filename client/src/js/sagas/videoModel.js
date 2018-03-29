import * as ActionTypes from "actions/actionTypes"
import {
    call,
    all,
    cancel,
    put,
    takeLatest,
    select,
} from "redux-saga/effects"

import {
    getActivePlaylistVideoId,
    getActivePlaylistModel,
} from "selectors/videoModel"

//****************
//PLAYBACK
//****************

function* doPlaybackModelUpdate(action) {
    if (!action.videoId) {
        const videoId = yield select(getActivePlaylistVideoId)
        action.videoId = videoId
    }
    yield put({
        type: ActionTypes.VIDEO_PLAYBACK_MODEL_UPDATE,
        payload: action,
    })
}

//****************
//PLAYLIST
//****************

function* doPlaylistModelUpdate(action) {
    const activePlaylistVideoId = yield select(
        getActivePlaylistVideoId
    )
    if (!action.videoId) {
    }
}

function* doPlaylistModelIncrement(action) {
    const playlistModel = yield select(getActivePlaylistModel)
    yield put({
        type: ActionTypes.VIDEO_PLAYLIST_MODEL_UPDATE,
        payload: {
            videoIndex: Math.min(
                playlistModel.videoIndex + 1,
                playlistModel.playlist.length - 1
            ),
        },
    })
}

//****************
//PLAYLIST
//****************
export function* playlistModelUpdate() {
    yield takeLatest(
        ActionTypes.VIDEO_PLAYLIST_MODEL_UPDATE,
        doPlaylistModelUpdate
    )
}

export function* playlistModelIncrement() {
    yield takeLatest(
        ActionTypes.VIDEO_PLAYLIST_MODEL_INCREMENT,
        doPlaylistModelIncrement
    )
}

//****************
//PLAYBACK
//****************
/*export function* playbackModelUpdate() {
    yield takeLatest(
        ActionTypes.VIDEO_PLAYBACK_MODEL_UPDATE,
        doPlaybackModelUpdate
    )
}
*/
