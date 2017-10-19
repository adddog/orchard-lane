import ThreeModel from "./threeModel"
import VideoModel from "./videoModel"

export default class OrchardModel {
  constructor(mapData){
    VideoModel.init(mapData)
    ThreeModel.init(mapData)
  }
}
