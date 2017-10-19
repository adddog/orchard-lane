import observable from "proxy-observable"
import { keys, assign, find } from "lodash"
import math from "usfl/math"
import BaseModel from "./baseModel"
import VideoModel from "orchardModels/videoModel"

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
  }

  _getCurrentWallData(videoId) {
    return find(this._mapData.get("wallData"), {
      videoId,
    })
  }

  /*
    Get the map data by videoId
  */
  get currentVideoData() {
    return this._mapData.get("raw")[this.currentVideoId]
  }

  get currentVideoManifests() {
    return this.getCurrentVideoManifests(this.currentVideoId)
  }

  getCurrentVideoManifests(videoId) {
    return find(this._mapData.get("videoManifests"), {
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

    o.x += this.observable.wallData.position.x
    o.y += this.observable.wallData.position.y

    return o
  }

  timeUpdate(t) {
    const { wallData } = this.observable
    const { videoCurrentTime } = VideoModel.currentVideo
    let _i = 0
    for (_i; _i < this.currentVideoData.points.length; _i++) {
      if (_i < this.currentVideoData.points.length - 2) {
        if (
          videoCurrentTime < this.currentVideoData.points[_i + 1].time
        ) {
          _i
          break
        }
      }
    }
    const cuepoint = this.currentVideoData.points[_i]
    const nextCuepoint = this.currentVideoData.points[_i + 1]

    const progress =
      (videoCurrentTime - cuepoint.time) /
      (nextCuepoint.time - cuepoint.time)

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
