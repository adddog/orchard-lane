import observable from "proxy-observable"
import { keys, assign, find, last } from "lodash"
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
      wallData: this._getCurrentWallData(this.currentVideoId),
    })

    VideoModel.observable.on("videoId", value => {
      this.observable.wallData = this._getCurrentWallData(value)
      console.log("-----------")
      console.log(this.observable.wallData)
      console.log("-----------")
    })
  }

  _getCurrentWallData(videoId) {
    return find(this._mapData.get("wallData"), {
      videoId,
    })
  }
  /*
  WHERE IN THE SVH PLOTTER ARE WE
  */
  get currentPlotterPoint() {
    const plotterProgress = this.observable.plotterProgress
    const index = Math.floor(
      (this.observable.wallData.points.length - 1) * plotterProgress
    )

    const o = {
      ...this.observable.wallData.points[index],
    }

    o.x += MAP_OFFSET_X
    o.y += MAP_OFFSET_Y

    return o
  }

  timeUpdate(t) {
    const { wallData } = this.observable
    const { videoCurrentTime } = VideoModel.currentVideo
    console.log(
      "videoStartTime",
      VideoModel.currentVideo.videoStartTime
    )
    console.log("videoCurrentTime", videoCurrentTime)
    let _i = 0
    for (
      _i;
      _i < VideoModel.currentVideoData.points.length - 2;
      _i++
    ) {
      if (
        videoCurrentTime <
        VideoModel.currentVideoData.points[_i + 1].time
      ) {
        _i
        break
      }
    }

    const cuepoint = VideoModel.currentVideoData.points[_i]
    console.log("--_--")
    console.log(cuepoint)
    const nextCuepoint =
      VideoModel.currentVideoData.points[_i + 1] || {}
    const nextCuepointTime =
      nextCuepoint.time ||
      last(VideoModel.currentVideoData.points).time

    const progress =
      (videoCurrentTime - cuepoint.time) /
      (nextCuepointTime - cuepoint.time)

    this.observable.plotterProgress = math.lerp(
      cuepoint.val,
      nextCuepoint.val,
      progress
    )
    console.log(
      "this.observable.plotterProgress",
      this.observable.plotterProgress
    )
  }

  updateValue(key, val) {
    this.observable[key] = val
  }
}

export default new ThreeModel()
