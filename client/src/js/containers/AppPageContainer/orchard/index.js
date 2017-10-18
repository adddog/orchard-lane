import MapDataModel from "orchardModels/mapDataModel"
import OrchardLaneMap from "orchardModels/map"

class OrchardLane {
  start(mapData) {
    if (!mapData) {
      throw new Error(`Need to set mapData on the Model first`)
    }

    MapDataModel.mapData = mapData
    OrchardLaneMap.start()


  }

  setActiveVideo(id) {
    this._plot.setActive(id)
  }

  getPlotProgress(t) {
  }
}

export default new OrchardLane()
