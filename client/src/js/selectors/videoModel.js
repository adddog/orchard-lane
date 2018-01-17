import { VIDEO_URL } from "utils/utils"
import { merge } from "lodash"

export const getVideoFormatString = state =>{
  const videoId = getActivePlaybackModel(state).videoId
  return `${videoId}/${videoId}_${getItag(state)}`
}

export const getAllVideoIds = state =>
  state.videoModel.get("videoJson").videoIds

export const getItag = state => state.videoModel.get("itag")

export const getActivePlaylistModel = state =>
  !state
    ? null
    : state.videoModel.get("videoPlaylistModels")[
        state.videoModel.get("activePlaylist")
      ]

export const getVideoUrl = state => {
  const model = getActivePlaylistModel(state)
  return model.playlist[model.videoIndex]
}

export const getActivePlaylistVideoId = state => {
  const model = getActivePlaylistModel(state)
  return model.playlist[model.videoIndex]
}

export const getActiveVideoManifest = state =>
  !state
    ? null
    : merge(
        state.videoModel.get("videoManifests")[
          getActivePlaylistVideoId(state)
        ],
        {
          url: `${VIDEO_URL}${getVideoFormatString(state)}`,
        }
      )

export const getActivePlaybackModel = state =>
  !state
    ? null
    : state.videoModel.get("videoPlaybackModels")[
        getActivePlaylistVideoId(state)
      ]
