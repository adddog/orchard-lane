import {
  SET_RUN_SETTINGS,
  LOAD_MAP_DATA_SUCCESS,
  SET_MAP_DATA_PLOT_PATHS,
  SET_VIDEO_MANIFESTS,
  INIT_LOAD_COMPLETE,
} from "actions/actionTypes"

import { Map } from "immutable"
import { keys, assign, pick, find } from "lodash"

const initialState = new Map({
  loadComplete: null,

  runSettings: null,

  raw: null,
  videoIds: null,
  videoManifests: null,
})

//const totalVideoDuration = sidx =>
//  sidx.references.reduce((acc, ref) => (acc += ref.durationSec), 0)

const totalVideoDuration = (state, videoManifest) =>
  state.get("raw")[videoManifest.videoId].videoData.endTime -
  state.get("raw")[videoManifest.videoId].videoData.startTime

const trimSidx = (videoData, videoManifest) => {

  videoManifest.sidx.references = videoManifest.sidx.references.filter(
    (ref, i) =>
      ref.startTimeSec >= videoData.startTime - ref.durationSec &&
      ref.startTimeSec <= videoData.endTime
  )
}

const makeWallData = state =>
  state.get("plotPaths").map(plotPath => ({
    points: plotPath.data.nodes,
    videoId: plotPath.id,
    position: pick(state.get("raw")[plotPath.id], ["x", "y"]),
  }))

export default function mapData(state = initialState, action) {
  switch (action.type) {
    case SET_RUN_SETTINGS: {
      const { payload } = action
      return state.set("runSettings", payload)
    }
    case LOAD_MAP_DATA_SUCCESS: {
      const { payload } = action
      return state.set("raw", payload).set("videoIds", keys(payload))
    }
    case SET_MAP_DATA_PLOT_PATHS: {
      const { payload } = action
      return state.set("plotPaths", payload)
    }
    case SET_VIDEO_MANIFESTS: {
      const { payload } = action

      return state.set(
        "videoManifests",
        payload.map(videoManifest => {
          trimSidx(
            state.get("raw")[videoManifest.videoId].videoData,
            videoManifest
          )

          console.log(videoManifest);

          return {
            ...videoManifest,
            duration: totalVideoDuration(state, videoManifest),
          }
        })
      )
    }
    case INIT_LOAD_COMPLETE: {
      const { payload } = action
      console.log(makeWallData(state))
      return state
        .set("wallData", makeWallData(state))
        .set("loadComplete", payload)
    }
    default: {
      return state
    }
  }
}
