import OrchardModel from "orchardModels"

class OrchardLane {
  start(state, dispatch) {

    if (!state) {
      throw new Error(`Need to set state, dispatch on the Model first`)
    }

    this.models = new OrchardModel(state, dispatch)
  }

  update(state){
    if(this.models){
      this.models.update(state)
    }
  }

  setActiveVideo(id) {
    this._plot.setActive(id)
  }

  getPlotProgress(t) {
  }
}

export default new OrchardLane()
