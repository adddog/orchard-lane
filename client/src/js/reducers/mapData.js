import {
  SET_JSON_RUN_SETTINGS,
  JSON_LOAD_MAP_DATA_SUCCESS,
  SET_MAP_DATA_PLOT_PATHS,
  JSON_VIDEO_DATA_SUCCESS,
  SET_JSON_VIDEO_MANIFESTS,
  INIT_LOAD_COMPLETE,
} from "actions/actionTypes"

import { Map } from "immutable"
import { keys, assign, pick, find } from "lodash"

const initialState = new Map({
  loadComplete: null,
  runSettings: {

  },
  raw: null,
})

const makeWallData = state =>
  state.get("plotPaths").map(plotPath => ({
    points: plotPath.data.nodes,
    videoId: plotPath.id,
    position: pick(state.get("raw")[plotPath.id], ["x", "y"]),
  }))

export default function mapData(state = initialState, action) {
  switch (action.type) {
    case SET_JSON_RUN_SETTINGS: {
      const { payload } = action
      return state.set("runSettings", {
        ...state.get("runSettings"),
        ...payload,
      })
    }
    case JSON_LOAD_MAP_DATA_SUCCESS: {
      const { payload } = action
      return state.set("raw", payload).set("videoIds", keys(payload))
    }
    case SET_MAP_DATA_PLOT_PATHS: {
      const { payload } = action
      return state.set("plotPaths", payload)
    }
    case INIT_LOAD_COMPLETE: {
      const { payload } = action
      return state
        .set("loadComplete", payload)
    }
    default: {
      return state
    }
  }
}
