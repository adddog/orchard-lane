import ThreeModel from "./threeModel"
import VideoModel from "./videoModel"

export default class OrchardModel {
  constructor(mapData){
    ThreeModel.init(mapData)
    VideoModel.init(mapData)
  }
}
