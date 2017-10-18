import { ASSET_URL, JSON_URL } from "utils/utils"
import MediaPlayer from "orchard-lane-media-player"

import Model from "orchardModels/mapDataModel"
import OrchardLaneMap from "orchardModels/map"

class VideoPlayer {
  init() {
    const { mapData, observable } = Model

    if (!mapData.get("loadComplete")) throw new Error(`Not loaded`)

    const videoIds = mapData.get("videoIds")

    if (!videoIds) {
      throw new Error(`Model hasn't loaded`)
    }

    return MediaPlayer(
      videoIds.map(id => `${JSON_URL}${id}_${observable.itag}.json`),
      {
        assetUrl: process.env.ASSET_URL,
      }
    ).then(mediaPlayer => {
      const { mediaSource, manifests, addFromReference } = mediaPlayer

      this._mediaPlayer = mediaPlayer

      this._addListeners()

      return mediaPlayer
      /*mediaSource.videoWaitingSignal.add(()=>{
          console.log("Waiting");
        })

        mediaSource.videoPausedSignal.add(()=>{
          console.log("videoPausedSignal");
        })*/

      //addFromReference(manifests[0], [0, 2])
    })
  }

  _addListeners() {
    const { mediaSource } = this._mediaPlayer
    const { observable } = Model

    observable.on("videoId", (value, prev) => {
      this.currentVideoManifest = Model.currentVideoManifests
    })

    mediaSource.endingSignal.add(() => {
      this._mediaPlayer.addFromReference(this.currentVideoManifest, [
        this.currentReferenceIndex,
      ])
    })

    mediaSource.timeUpdateSignal.add(t => {
      let _previousTime = null
      if (_previousTime !== t) {
        Model.updateValue(
          "plotterProgress",
          OrchardLaneMap.getPlotProgress(t * 1000)
        )
      }
      Model.updateValue("videoProgress", t)
      _previousTime = t
    })
  }

  get currentVideoManifest() {
    if (!this._currentVideoManifest)
      return Model.currentVideoManifests
    return this._currentVideoManifest
  }

  set currentVideoManifest(m) {
    this._currentVideoManifest = m
  }

  get currentReferenceIndex() {
    const { currentVideoManifests, observable } = Model
    const { plotterProgress } = observable
    const i = Math.floor(
      currentVideoManifests.sidx.references.length * plotterProgress
    )
    return i
  }

  start() {
    const { mapData, observable } = Model

    if (!this._mediaPlayer) throw new Error(`No mediaplayer!`)

    this._mediaPlayer.addFromReference(this.currentVideoManifest, [
      this.currentReferenceIndex,
    ])
  }
}

export default new VideoPlayer()
