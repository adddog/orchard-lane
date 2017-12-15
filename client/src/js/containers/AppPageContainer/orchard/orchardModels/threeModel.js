import observable from "proxy-observable"
import { keys, assign, find, last } from "lodash"
import { vec2 } from "gl-matrix"
import math from "usfl/math"
import BaseModel from "./baseModel"
import VideoModel from "orchardModels/videoModel"

const MAP_OFFSET_X = 10
const MAP_OFFSET_Y = 10

class ThreeModel extends BaseModel {
  /*
     WE CAN ATTACH LISTENERS TO THIS MODEL AROUND THE APP
  */
  init(mapData) {
    super.init(mapData)
    this.observable = observable({
      plotterProgress: 0,
      faceIndex: 0,
      wallData: this._getCurrentWallData(this.currentVideoId),
    })

    VideoModel.observable.on("videoId", value => {
      this.observable.wallData = this._getCurrentWallData(value)
    })
  }

  _getCurrentWallData(videoId) {
    return find(this._mapData.get("wallData"), {
      videoId,
    })
  }

  get videoData() {
    return this.observable.wallData
  }

  get previousPlotterPoint(){
    return this._previousPlotterPoint || {
      angle:0
    }
  }

  /*
  WHERE IN THE SVH PLOTTER ARE WE
  */
  get currentPlotterPoint() {
    const plotterProgress = this.observable.plotterProgress
    const index = Math.floor(
      (this.observable._getCurrentWallData.points.length - 1) * plotterProgress
    )

    const previousPoint = this.observable.wallData.points[index - 1]
    const o = {
      angle: 0,
      ...this.observable.wallData.points[index],
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

  timeUpdate(t) {
    const { wallData } = this.observable
    const { videoCurrentTime } = VideoModel.currentVideo
    /*console.log(
      "videoStartTime",
      VideoModel.currentVideo.videoStartTime
    )
    console.log("videoCurrentTime", videoCurrentTime)*/
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

    this.observable.plotterProgress = math.lerp(
      cuepoint.val,
      nextCuepoint.val,
      progress
    )
  }

  updateValue(key, val) {
    this.observable[key] = val
  }
}

export default new ThreeModel()
