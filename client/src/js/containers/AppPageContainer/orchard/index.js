import OrchardModel from "orchardModels"
import ThreeScene from "orchard-lane-three"
import VideoPlayer from "videoPlayer"
import Scene from "threeScene"

class OrchardLane {
  constructor(props, dispatch) {
    this.models = new OrchardModel(props, dispatch)

    this.mediaPlayer = new VideoPlayer()

    const {config, containerEl} = props

    this.threeSCene = new Scene(
      ThreeScene(this.mediaPlayer.mediaSource.el, containerEl, {
        hide: config.get("hideVideo"),
      })
    )

  }

  update(props){
    if(this.models){
      this.models.update(props)
    }
  }

  setActiveVideo(id) {
    this._plot.setActive(id)
  }

  getPlotProgress(t) {
  }

}

export default OrchardLane
