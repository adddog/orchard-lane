import { ASSET_URL, JSON_URL } from "utils/utils"
import MediaPlayer from "orchard-lane-media-player"

import VideoModel from "orchardModels/videoModel"
import ThreeModel from "orchardModels/threeModel"
import OrchardLaneMap from "orchardModels/map"

class VideoPlayer {
  init() {
    const { mapData, observable } = VideoModel

    if (!mapData.get("loadComplete")) throw new Error(`Not loaded`)

    const videoIds = mapData.get("videoIds")

    if (!videoIds) {
      throw new Error(`VideoModel hasn't loaded`)
    }

    this._mediaPlayer = MediaPlayer({
      assetUrl: process.env.ASSET_URL,
    })

    this._addListeners()

    return this._mediaPlayer
  }

  _addListeners() {
    const { mediaSource } = this._mediaPlayer
    const { observable, currentVideo } = VideoModel

    observable.on("videoId", (value, prev) => {
      observable[value].curr
      this.currentVideoManifest = Model.getCurrentVideoManifest(value)
    })

    mediaSource.endingSignal.add(() => {
      VideoModel.incrementReference(1)
      this.addReference()
    })

    mediaSource.timeUpdateSignal.add(t => {
      VideoModel.timeUpdate(t)
      ThreeModel.timeUpdate(t)
      /*let _previousTime = null
      if (_previousTime !== t) {
        Model.updateValue(
          "plotterProgress",
          OrchardLaneMap.getPlotProgress(t * 1000)
        )
      }
      Model.updateValue("videoProgress", t)
      _previousTime = t*/
    })
    mediaSource.segmentAddedSignal.add(t => {
      VideoModel.referenceAdded()
    })
  }

  get currentVideoManifest() {
    if (this._currentVideoManifest) return this._currentVideoManifest
    return VideoModel.currentVideoManifest
  }

  set currentVideoManifest(m) {
    this._currentVideoManifest = m
  }

  get currentReferenceFromPlotterProgress() {
    const { currentVideoManifest, observable } = VideoModel
    const { plotterProgress } = observable
    const i = Math.floor(
      currentVideoManifest.sidx.references.length * plotterProgress
    )
    return i
  }

  getReferenceByTime(time) {
    const { currentVideoManifest } = VideoModel
    let _i = 0
    let _found = false
    while (!_found) {
      if (
        currentVideoManifest.sidx.references[i].startTimeSec >= time
      ) {
        _found = true
        _i--
        break
      }
      _i++
    }
    return _i
  }

  addReference() {
    const { currentVideo } = VideoModel
    VideoModel.addReference()
    this._mediaPlayer.addFromReference(
      this.currentVideoManifest,
      currentVideo.currentReference
    )
  }

  start() {
    const { currentVideo } = VideoModel

    if (!this._mediaPlayer) throw new Error(`No mediaplayer!`)

    this.currentVideoManifest = VideoModel.getCurrentVideoManifest()

    this.addReference()
  }
}

export default new VideoPlayer()
