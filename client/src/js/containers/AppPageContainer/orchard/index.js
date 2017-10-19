import OrchardModel from "orchardModels"

class OrchardLane {
  start(mapData) {
    if (!mapData) {
      throw new Error(`Need to set mapData on the Model first`)
    }

    this.model = new OrchardModel(mapData)
    //OrchardLaneMap.start()


  }

  setActiveVideo(id) {
    this._plot.setActive(id)
  }

  getPlotProgress(t) {
  }
}

export default new OrchardLane()
