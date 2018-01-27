import observable from "proxy-observable"
import { keys, assign, find, last } from "lodash"
import { vec2 } from "gl-matrix"
import { getActiveWallData } from "selectors/threeModel"
import math from "usfl/math"
import BaseModel from "./baseModel"
import VideoModel from "orchardModels/videoModel"

const MAP_OFFSET_X = 10
const MAP_OFFSET_Y = 10

class ThreeModel extends BaseModel {
  init(store, dispatch) {
    this.update(store)
    this.dispatch = dispatch
    this.state = observable({
      plotterProgress: 0,
      faceIndex: 0,
    })
  }

  update(store) {
    this.store = store
    this.currentWallData = getActiveWallData(this.store)
    this.timeUpdate(this.store.activePlaybackModel)
    this.emit("update")
  }
  /*
  init(mapData) {
    super.init(mapData)
    this.state = observable({
      plotterProgress: 0,
      faceIndex: 0,
      wallData: this._getCurrentWallData(this.currentVideoId),
    })

    VideoModel.observable.on("videoId", value => {
      this.state.wallData = this._getCurrentWallData(value)
    })
  }
*/

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

  /*
  WHERE IN THE SVH PLOTTER ARE WE
  */
  get currentPlotterPoint() {
    const plotterProgress = this.state.plotterProgress
    const index = Math.floor(
      (this.currentWallData.points.length - 1) * plotterProgress
    )

    const previousPoint = this.currentWallData.points[index - 1]
    const o = {
      angle: 0,
      ...this.currentWallData.points[index],
    }

    o.x += MAP_OFFSET_X
    o.y += MAP_OFFSET_Y

    if (previousPoint) {
      o.angle =
        (1 -
          vec2.dot(
            vec2.normalize(vec2.create(), vec2.fromValues(o.x, o.y)),
            vec2.normalize(
              vec2.create(),
              vec2.fromValues(previousPoint.x, previousPoint.y)
            )
          )) *
        (previousPoint.x < o.x ? 1 : -1)
    }

    this._previousPlotterPoint = o

    return o
  }

  timeUpdate(activePlaybackModel) {
    console.log(this.currentWallData);
    const { wallData } = this.state
    const { videoCurrentTime } = VideoModel.currentVideo
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
