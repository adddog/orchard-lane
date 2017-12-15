import observable from "proxy-observable"
import { keys, assign, find, last } from "lodash"
import BaseModel from "./baseModel"
import ThreeModel from "orchardModels/threeModel"
import { ITAG } from "utils/utils"
import {
  getActivePlaylistModel,
  getActiveVideoManifest,
  getActivePlaylistVideoId,
  getActivePlaybackModel,
} from "selectors/videoModel"

class VideoModel {
  init(props, dispatch) {
    const { state } = props
    this.props = props
    this.state = state
    this.dispatch = dispatch

    this.observable = observable({
      itag: ITAG,
      videoId: getActivePlaylistVideoId(state),
    })

    this.observable.on("videoId", value => {
      const refI = Math.floor(
        (this._currentVideoManifest.sidx.references.length - 1) *
          ThreeModel.observable.faceIndex
      )
      this.observable[value].currentReference = [refI, refI + 1]
      this.observable[value].videoStartTime = last(
        this.playbackTimecodes
      )
    })

    this.playbackTimecodes = []
    this.playbackDict = []

    this.stateUpdated(state)
  }

  stateUpdated(state) {
    this.playlistModel = getActivePlaylistModel(state)
    this.videoManifest = getActiveVideoManifest(state)
    this.playbackModel = getActivePlaybackModel(state)
  }

  getActiveVideoManifest() {
    return getActiveVideoManifest(this.state)
  }

  timeUpdate(t) {
    const { videoStartTime } = this.playbackModel
    this.props.updatePlaybackModel({
      videoId:this.playbackModel.videoId,
      videoCurrentTime: t - videoStartTime,
      videoProgress:
        this.playbackModel.videoCurrentTime /
        this.playbackModel.duration,
    })
  }

  addReference() {}

  referenceAdded() {
    this.playbackModel.referenceStartTime =
      last(this.playbackTimecodes) || 0
    this.playbackDict.push({
      videoId: this.playbackModel.videoId,
      reference: [...this.playbackModel.currentReference],
    })
    this.playbackTimecodes.push(
      this.playbackModel.referenceStartTime +
        getRefDuration(this.videoManifest, this.playbackModel)
    )
  }

  /*
    Get the map data by videoId
  */
  get currentVideoManifest() {
    return this.videoManifest
  }

  incrementReference(count) {
    count += 1
    this.playbackModel.currentReference = this.playbackModel.currentReference.map(
      ref => (ref += count)
    )
  }

  get currentVideo() {
    return this.playbackModel
  }
}

const getRefDuration = (currentVideoManifest, currentVideo) => {
  let duration = 0
  const { references } = currentVideoManifest.sidx
  for (
    var j = currentVideo.currentReference[0];
    j <= currentVideo.currentReference[1];
    j++
  ) {
    duration += references[j]["durationSec"]
  }
  return duration
}

export default new VideoModel()
