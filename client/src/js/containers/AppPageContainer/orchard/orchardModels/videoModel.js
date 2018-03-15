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

class VideoModel extends BaseModel{
  constructor() {
    super()
  }

  init(state, dispatch) {
    this.update(state)
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
  }

  update(state) {
    this.state = state
    this.playlistModel = getActivePlaylistModel(state)
    this.videoManifest = getActiveVideoManifest(state)
    this.playbackModel = getActivePlaybackModel(state)
    this.emit("update")
  }

  getActiveVideoManifest() {
    return getActiveVideoManifest(this.state)
  }

  timeUpdate(t) {
    const { videoStartTime } = this.playbackModel
    this.state.updatePlaybackModel({
      videoId: this.playbackModel.videoId,
      videoCurrentTime: t - videoStartTime,
      videoProgress:
        this.playbackModel.videoCurrentTime /
        this.playbackModel.duration,
    })
  }

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
    /**~~~~**
        next video in playlist
    **~~~~**/
    if (count > this.videoManifest.sidx.references.length - 1) {
      this.state.updatePlaylistModel({
        videoIndex: this.playlistModel.videoIndex++,
      })
    } else {
      /**~~~~**
          next reference
      **~~~~**/
      this.state.updatePlaybackModel({
        videoId: this.playbackModel.videoId,
        currentReference: this.playbackModel.currentReference.map(
          ref => (ref += count)
        ),
      })
    }
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
