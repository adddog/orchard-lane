import ThreeModel from "./threeModel"
import VideoModel from "./videoModel"

export default class OrchardModel {
  constructor(props, dispatch){
    VideoModel.init(props, dispatch)
//    ThreeModel.init(state, dispatch)
  }

  update(props){

  }
}
