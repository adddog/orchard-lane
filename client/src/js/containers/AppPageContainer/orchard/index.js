import OrchardModel from "orchardModels"

class OrchardLane {
  start(state, dispatch) {

    if (!state) {
      throw new Error(`Need to set state, dispatch on the Model first`)
    }

    this.model = new OrchardModel(state, dispatch)

  }

  update(state){

  }

  setActiveVideo(id) {
    this._plot.setActive(id)
  }

  getPlotProgress(t) {
  }
}

export default new OrchardLane()
