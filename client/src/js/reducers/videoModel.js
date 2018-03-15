import { ASSET_URL } from "utils/utils"
import {
  SET_JSON_RUN_SETTINGS,
  SET_JSON_VIDEO_MANIFESTS,
  JSON_VIDEO_DATA_SUCCESS,
  VIDEO_VIDEO_ID_SET,
  VIDEO_PLAYBACK_MODEL_UPDATE,
  VIDEO_PLAYLIST_MODEL_UPDATE,
  INIT_LOAD_COMPLETE,
} from "actions/actionTypes"

import { Map } from "immutable"
import { isArray, keys, assign, pick, find, map } from "lodash"

const initialState = new Map({
  tick: 0,
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

const createVideoPlaybackModels = (state, videoJson) => {
  const { videoIds, videoData } = videoJson
  const model = {}
  videoIds.forEach(videoId => {
    const d = videoData[videoId] || {}
    model[videoId] = {
      videoId: videoId,
      url: `${ASSET_URL}videos/${videoId}/${videoId}_${state.get(
        "itag"
      )}`,
      startTime: d.startTime || 0,
      endTime: d.endTime,
      initialRotation: d.initialRotation || 0,
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
    /*************
        INIT
    *************/
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
            createVideoPlaybackModels(state, payload)
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
        /*
      Modify the manifests
      */
        .map(videoManifest => {
          /*
          Direct on the object
          */
          const manifest = isArray(videoManifest)
            ? videoManifest[0]
            : videoManifest
          //trimSidx(videoData[manifest.videoId], manifest)

          return {
            ...manifest,
            duration: totalVideoDuration(
              videoData[manifest.videoId],
              manifest
            ),
          }
        })
        /*
        Convert to an object
        */
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

      return state
        .set("videoManifests", videoManifests)
        .set("videoPlaybackModels", videoPlaybackModels)
    }
    case INIT_LOAD_COMPLETE: {
      const { payload } = action
      const videoManifests = state.get("videoManifests")
      const { playlists } = state.get("videoJson")
      for (let name in playlists) {
        playlists[name] = playlists[name].filter(
          videoId => !!videoManifests[videoId]
        )
      }
      return state.set(
        "videoPlaylistModels",
        createVideoPlaylistsModels(playlists)
      )
    }
    /*
    //************
    UPDATE
    //************
    */
    case VIDEO_VIDEO_ID_SET: {
      console.log(action.payload);
      return state.set("videoId", action.payload)
    }
    case VIDEO_PLAYBACK_MODEL_UPDATE: {
      const { payload } = action
      const videoPlaybackModels = state.get("videoPlaybackModels")
      videoPlaybackModels[payload.videoId] = {
        ...videoPlaybackModels[payload.videoId],
        ...payload,
      }
      return state
        .set("videoPlaybackModels", videoPlaybackModels)
        .set("tick", state.get("tick") + 1)
    }
    case VIDEO_PLAYLIST_MODEL_UPDATE: {
      const { payload } = action
      const videoPlaylistModel = {
        ...state.get("videoPlaylistModels")[
          state.get("activePlaylist")
        ],
        ...payload,
      }
      return state.set("videoPlaylistModels", {
        ...state.get("videoPlaylistModels"),
        [state.get("activePlaylist")]: videoPlaylistModel,
      })
    }
    default: {
      return state
    }
  }
}
