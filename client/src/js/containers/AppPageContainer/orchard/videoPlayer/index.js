import { REMOTE_VIDEO_ASSET_URL, JSON_URL } from "utils/utils"
import { last, noop } from "lodash"
import { logBlock } from "utils/log"
import MediaPlayer from "orchard-lane-media-player"
import VideoModel from "orchardModels/videoModel"
import ThreeModel from "orchardModels/threeModel"

class VideoPlayer {

  constructor() {
    this._mediaPlayer = MediaPlayer({
      assetUrl: REMOTE_VIDEO_ASSET_URL,
    })

    this._addListeners()
    this.addReference()
  }

  get mediaSource() {
    return this._mediaPlayer.mediaSource
  }

  _addListeners() {
    const { mediaSource } = this._mediaPlayer
    const { observable } = VideoModel
    VideoModel.on("update",()=>{
      console.log(this.playbackModel);
    })

    let _newVideo = false
    observable.on("videoId", (value, prev) => {
      _newVideo = true
      this.currentVideoManifest = VideoModel.getCurrentVideoManifest(
        value
      )
    })

    /******************
    MEDIA UPDATE LISTENERS
    ******************/
    mediaSource.endingSignal.add(() => {
      logBlock(`mediaSource endingSignal`);
      VideoModel.incrementReference(1)
      this.addReference()
    })

    mediaSource.timeUpdateSignal.add(t => {
      VideoModel.timeUpdate(t)
      //ThreeModel.timeUpdate(t)
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
      if (_newVideo) {
        mediaSource.currentTime = last(
          VideoModel.playbackTimecodes
        ).toFixed(3)
      }
      _newVideo = false
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
    console.log("-------------------");
    console.log(currentVideo);
    console.log("-------------------");
    this._mediaPlayer.addFromReference(
      this.currentVideoManifest,
      currentVideo.currentReference
    )
  }
}

export default VideoPlayer
