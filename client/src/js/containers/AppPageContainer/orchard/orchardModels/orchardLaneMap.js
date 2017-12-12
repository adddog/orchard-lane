import Q from "bluebird"
import Model from "./mapDataModel"

/*

PARSER OF INPUTS FOR WORKING WITH MAP.JSON

*/

const mapValues = (val, in_min, in_max, out_min, out_max) =>
  (val - in_min) * (out_max - out_min) / (in_max - in_min) + out_min

/*
TAKE A PROGRESS VALUE IN MILLISECONDS AND USING THE JSON,
RETURN A 0-1 OF WHOLE VIDEO
*/
const PlotPoints = data => {
  let _points = null
  let _nextPoint = null

  function setActive(id) {
    if (!data[id]) throw new Error(`No data on ${id}`)
    _points = data[id].points
    if (!_points) throw new Error(`No points on ${id}`)
  }

  function update(timeProgress) {
    _nextPoint = _points.filter(obj => timeProgress <= obj.time)[0]

    if (_nextPoint) {
      const previousPoint = _points[
        _points.indexOf(_nextPoint) - 1
      ] || { time: 0, val: 0 }
      const { time, val } = _nextPoint
      const pointProgressTime =
        1 - (time - timeProgress) / (time - previousPoint.time)

      const svgPlotProgress =
        mapValues(
          pointProgressTime,
          0,
          1,
          0,
          val - previousPoint.val
        ) + previousPoint.val

      return svgPlotProgress
    }
    return 0
  }

  return {
    setActive: setActive,
    update: update,
  }
}

class OrchardLaneMap {
  start() {
    if (!Model.mapData) {
      throw new Error(`Need to set mapData on the Model first`)
    }
    this._plot = PlotPoints(Model.mapData.get('raw'))
    const { observable } = Model
    const onCoinsChanged = observable.on("videoId", (value, prev) => {
      this.setActiveVideo(value)
    })
    this.setActiveVideo(observable.videoId)
  }

  setActiveVideo(id) {
    this._plot.setActive(id)
  }

  /*
  GET A 0-1, SEE ABOVE
  */
  getPlotProgress(t) {
    return this._plot.update(t)
  }
}

export default new OrchardLaneMap()
