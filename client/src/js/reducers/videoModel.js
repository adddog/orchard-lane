import {
  SET_JSON_RUN_SETTINGS,
  SET_JSON_VIDEO_MANIFESTS,
  JSON_VIDEO_DATA_SUCCESS,
  VIDEO_PLAYBACK_MODEL_UPDATE,
  VIDEO_PLAYLIST_MODEL_UPDATE,
} from "actions/actionTypes"

import { Map } from "immutable"
import { keys, assign, pick, find, map } from "lodash"

const initialState = new Map({
  runSettings: null,
  videoManifests: null,
  videoJson: null,
  videoPlaybackModels: null,
  videoPlaylistModels: null,
  itag: Detector.isMobile ? "137" : "266",
  activePlaylist: "",
  videoId: "",
})

const createVideoPlaylistsModels = playlists => {
  const _o = {}
  for (let name in playlists) {
    _o[name] = {
      playlist: playlists[name],
      videoIndex: 0,
    }
  }
  return _o
}

const createVideoPlaybackModels = videoJson => {
  const { videoIds, videoData } = videoJson
  const model = {}
  videoIds.forEach(videoId => {
    const d = videoData[videoId] || {}
    model[videoId] = {
      videoId: videoId,
      startTime: d.startTime || 0,
      endTime: d.endTime,
      initialRotation: d.initialRotation,
      videoStartTime: 0,
      videoCurrentTime: 0,
      videoProgress: 0,
      referenceStartTime: 0,
      referenceTime: 0,
      currentReference: [0, 1],
    }
  })
  return model
}

const totalVideoDuration = (videoData, videoManifest) =>
  videoData
    ? videoData.endTime - videoData.startTime
    : videoManifest.sidx.references.reduce(
        (accum, ref) => (accum += ref.durationSec),
        0
      )

const trimSidx = (videoData, videoManifest) => {
  if (videoData) {
    videoManifest.sidx.references = videoManifest.sidx.references.filter(
      (ref, i) =>
        ref.startTimeSec >= videoData.startTime - ref.durationSec &&
        ref.startTimeSec <= videoData.endTime
    )
  }
}

export default function mapData(state = initialState, action) {
  switch (action.type) {
    case SET_JSON_RUN_SETTINGS: {
      const { payload } = action
      return state
        .set("runSettings", {
          ...state.get("runSettings"),
          ...payload,
        })
        .set("videoId", payload.videoId ? payload.videoId : "")
        .set("itag", payload.itag ? payload.itag : state.get("itag"))
    }
    case JSON_VIDEO_DATA_SUCCESS: {
      const { payload } = action
      return (
        state
          .set("videoJson", payload)
          /*
        {
        [videoId]:{}
        }
        */
          .set(
            "videoPlaybackModels",
            createVideoPlaybackModels(payload)
          )
          /*
        {
        [name]:{}
        }
        */
          .set(
            "videoPlaylistModels",
            createVideoPlaylistsModels(payload.playlists)
          )
          .set(
            "activePlaylist",
            state.get("runSettings").playlist ||
              keys(payload.playlists)[0]
          )
      )
    }
    case SET_JSON_VIDEO_MANIFESTS: {
      const { payload } = action
      const videoData = state.get("videoJson").videoData

      const videoPlaybackModels = state.get("videoPlaybackModels")

      const videoManifests = payload
        .map(videoManifest => {
          trimSidx(videoData[videoManifest.videoId], videoManifest)
          return {
            ...videoManifest,
            duration: totalVideoDuration(
              videoData[videoManifest.videoId],
              videoManifest
            ),
          }
        })
        .reduce((_accum, videoManifest) => {
          _accum[videoManifest.videoId] = videoManifest

          videoPlaybackModels[videoManifest.videoId].duration =
            videoManifest.duration

          /*update*/
          videoPlaybackModels[videoManifest.videoId].endTime =
            videoPlaybackModels[videoManifest.videoId].endTime ||
            videoManifest.duration

          return _accum
        }, {})

      console.log("-------")
      console.log(videoManifests)
      console.log("-------")
      return state
        .set("videoManifests", videoManifests)
        .set("videoPlaybackModels", videoPlaybackModels)
    }
    case VIDEO_PLAYBACK_MODEL_UPDATE: {
      const { payload } = action
      const videoPlaybackModels = state.get("videoPlaybackModels")
      videoPlaybackModels[payload.videoId] = {
        ...videoPlaybackModels[payload.videoId],
        ...payload,
      }
      return state.set("videoPlaybackModels", videoPlaybackModels)
    }
    case VIDEO_PLAYLIST_MODEL_UPDATE: {
      const { payload } = action
      const videoPlaylistModel = {
        ...state.get("videoPlaylistModels")[
          state.videoModel.get("activePlaylist")
        ],
        ...payload,
      }
      console.log(videoPlaylistModel);
      return state.set("videoPlaylistModels", {
        ...state.get("videoPlaylistModels"),
        [state.videoModel.get("activePlaylist")]: videoPlaylistModel,
      })
    }

    default: {
      return state
    }
  }
}