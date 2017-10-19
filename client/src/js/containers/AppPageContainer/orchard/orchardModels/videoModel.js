import observable from "proxy-observable"
import { keys, assign, find, last } from "lodash"
import BaseModel from "./baseModel"
import { ITAG } from "utils/utils"

const createVideoPlaybackModel = mapData => {
  const model = {}
  const raw = mapData.get("raw")
  for (const videoId in raw) {
    model[videoId] = {
      videoId: videoId,
      startTime: raw[videoId].videoData.startTime,
      endTime: raw[videoId].videoData.endTime,
      videoStartTime: 0,
      videoCurrentTime: 0,
      videoProgress: 0,
      referenceStartTime: 0,
      referenceTime: 0,
      currentReference: [0, 1],
    }
  }
  return model
}

class VideoModel extends BaseModel {

  init(mapData) {
    super.init(mapData)
    this.observable = observable({
      itag: this.mapData.get("runSettings").itag || ITAG,
      videoId: this.currentVideoId,
      ...createVideoPlaybackModel(this._mapData),
    })

    this.observable.on("videoId", value => {
      this.observable[value].videoStartTime = last(this.playbackTimecodes)
    })

    this.playbackTimecodes = []
    this.playbackDict = []
  }

  timeUpdate(t) {
    const { videoStartTime } = this.currentVideo
    /*if (t > this.currentVideo.referenceStartTime) {
      this.currentVideo.referenceStartTime = last(
        this.playbackTimecodes
      )
      this.currentVideo.referenceTime =
        t - this.currentVideo.referenceStartTime
    } else {
      this.currentVideo.referenceTime = t
    }*/
    /*console.log(
      "this.currentVideo.referenceStartTime",
      this.currentVideo.referenceStartTime
    )
    console.log(
      "this.currentVideo.referenceTime",
      this.currentVideo.referenceTime
    )*/
    this.currentVideo.videoCurrentTime = (t - videoStartTime)
    this.currentVideo.videoProgress = this.currentVideo.videoCurrentTime / this._currentVideoManifest.duration
  }

  addReference() {}

  referenceAdded() {
    this.currentVideo.referenceStartTime = last(this.playbackTimecodes) || 0
    this.playbackDict.push({
      videoId: this.currentVideo.videoId,
      reference: [...this.currentVideo.currentReference],
    })
    this.playbackTimecodes.push(
      this.currentVideo.referenceStartTime +
        getRefDuration(this.currentVideoManifest, this.currentVideo)
    )
  }

  /*
    Get the map data by videoId
  */
  get currentVideoData() {
    return this._mapData.get("raw")[this.observable.videoId]
  }

  get currentVideoManifest() {
    return this.getCurrentVideoManifest(this.observable.videoId)
  }

  incrementReference(count) {
    count += 1
    this.currentVideo.currentReference = this.currentVideo.currentReference.map(
      ref => (ref += count)
    )
  }

  getCurrentVideoManifest(videoId) {
    videoId = videoId || this.currentVideoId
    this._currentVideoManifest = find(
      this._mapData.get("videoManifests"),
      {
        videoId,
      }
    )
    return this._currentVideoManifest
  }

  get currentVideo() {
    return this.observable[this.observable.videoId]
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
