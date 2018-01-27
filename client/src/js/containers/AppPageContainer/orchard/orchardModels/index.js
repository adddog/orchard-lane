import ThreeModel from "./threeModel"
import VideoModel from "./videoModel"

export default class OrchardModel {
  constructor(props, dispatch){
    VideoModel.init(props, dispatch)
    ThreeModel.init(props, dispatch)
  }

  update(props){
    VideoModel.update(props)
    ThreeModel.update(props)
  }

  createProps(props){
    return {
      ...props,
    }
  }
}
