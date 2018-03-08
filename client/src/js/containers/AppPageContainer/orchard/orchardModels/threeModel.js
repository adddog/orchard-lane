import observable from "proxy-observable"
import { keys, assign, find, last } from "lodash"
import { vec2 } from "gl-matrix"
import { getActiveWallData } from "selectors/threeModel"
import {
  getTotalPlotProgress,
  getPlotterPointByProgress,
} from "selectors/mapData"
import math from "usfl/math"
import BaseModel from "./baseModel"
import VideoModel from "orchardModels/videoModel"

class ThreeModel extends BaseModel {
  init(store, dispatch) {
    this.state = observable({
      plotterProgress: 0,
      faceIndex: 0,
    })
    this.update(store)
    this.dispatch = dispatch
  }

  update(store) {
    this.store = store
    this.currentWallData = getActiveWallData(this.store)
    this.timeUpdate(this.store.activePlaybackModel)
    this.emit("update")
  }

  get mapData() {
    return this.store.mapData
  }

  get previousPlotterPoint() {
    return (
      this._previousPlotterPoint || {
        angle: 0,
      }
    )
  }

  get currentPlotterPoint() {
    return this._currentPlotterPoint || this.previousPlotterPoint
  }

  timeUpdate(activePlaybackModel) {
    const { activeMapData } = this.state
    const { videoCurrentTime } = activePlaybackModel
    this._previousPlotterPoint = this.currentPlotterPoint
    const plotterPointByProgress = getPlotterPointByProgress(
      this.store,
      getTotalPlotProgress(this.store, videoCurrentTime),
      this.currentWallData
    )
    this._currentPlotterPoint = plotterPointByProgress
    return
    let _i = 0
    for (
      _i;
      _i < VideoModel.currentRawVideoData.points.length - 2;
      _i++
    ) {
      if (
        videoCurrentTime <
        VideoModel.currentRawVideoData.points[_i + 1].time
      ) {
        _i
        break
      }
    }

    const cuepoint = VideoModel.currentRawVideoData.points[_i]
    const nextCuepoint =
      VideoModel.currentRawVideoData.points[_i + 1] || {}
    const nextCuepointTime =
      nextCuepoint.time ||
      last(VideoModel.currentRawVideoData.points).time

    const progress =
      (videoCurrentTime - cuepoint.time) /
      (nextCuepointTime - cuepoint.time)

    this.state.plotterProgress = math.lerp(
      cuepoint.val,
      nextCuepoint.val,
      progress
    )
  }

  updateValue(key, val) {
    this.state[key] = val
  }
}

export default new ThreeModel()
