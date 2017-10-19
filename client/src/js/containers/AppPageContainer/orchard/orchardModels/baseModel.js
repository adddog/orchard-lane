export default class BaseModel {
  init(mapData) {
    this._mapData = mapData
    if (this._mapData.size < 1) throw new Error(`No size on mapData`)
  }

  get currentVideoId() {
    if (this._mapData.size < 1) throw new Error(`No size on mapData`)
    if (this.observable.videoId) return this.observable.videoId
    if (this._mapData.get("runSettings").videoId)
      return this._mapData.get("runSettings").videoId
    //first of map_data
    return this._mapData.get("videoIds")[0]
  }

  get mapData() {
    return this._mapData
  }

  set observable(o) {
    this._observable = o
  }

  get observable() {
    return this._observable || {}
  }

  updateValue(key, val) {
    this.observable[key] = val
  }
}
