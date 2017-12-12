import observable from "proxy-observable"
import { keys, assign, find } from "lodash"

/***********

Create an
************/

const createVideoPlaybackModel = (
  videoId,
  { startTime, endTime, initialRotation }
) => ({
  videoId,
  startTime,
  endTime,
  initialRotation,
  currentStartTime: 0,
  currentTime: 0,
})

class Model {
  /*
     WE CAN ATTACH LISTENERS TO THIS MODEL AROUND THE APP
  */
  set mapData(mapData) {
    this._mapData = mapData
    if (this._mapData.size < 1) throw new Error(`No size on mapData`)
    if (!this.observable) {
      this.observable = observable(
        assign(
          {},
          {
            videoId: "",
            videoProgress: 0,
            plotterProgress: 0,
          },
          this._mapData.get("runSettings")
        )
      )

      this._videoModel = {}
      for (const { videoId, videoData } in this._mapData.get("raw")) {
        this._videoModel[videoId] = createVideoPlaybackModel(
          videoId,
          videoData
        )
      }

      this.currentData = {
        wallData: null,
      }
      this._updateCurrentData()

      this.observable.on("videoId", value => {
        this._updateCurrentData()
      })
    }
  }

  _updateCurrentData() {
    this.currentData.wallData = find(this._mapData.get("wallData"), {
      videoId: this.observable.videoId,
    })
  }

  get videoModel() {
    return this._videoModel
  }

  get mapData() {
    return this._mapData
  }

  set observable(o) {
    this._observable = o
  }

  get observable() {
    return this._observable
  }
  /*
    Get the map data by videoId
  */
  get currentVideoData() {
    return this._mapData.get("raw")[this.observable.videoId]
  }

  get currentVideoManifests() {
    return this.getCurrentVideoManifests(this.observable.videoId)
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
      (this.currentData.wallData.points.length - 1) * plotterProgress
    )

    const o = {
      ...this.currentData.wallData.points[index],
    }

    o.x += this.currentData.wallData.position.x
    o.y += this.currentData.wallData.position.y

    return o
  }

  updateValue(key, val) {
    this.observable[key] = val
  }
}

export default new Model()
