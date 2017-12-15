export const getAllVideoIds = state =>
  state.videoModel.get("videoJson").videoIds

export const getActivePlaylistModel = state =>
  state.videoModel.get("videoPlaylistModels")[
    state.videoModel.get("activePlaylist")
  ]

export const getActivePlaylistVideoId = state => {
  const model = getActivePlaylistModel(state)
  return model.playlist[model.videoIndex]
}

export const getActiveVideoManifest = state =>
  state.videoModel.get("videoManifests")[
    getActivePlaylistVideoId(state)
  ]

export const getActivePlaybackModel = state =>
  state.videoModel.get("videoPlaybackModels")[
    getActivePlaylistVideoId(state)
  ]
