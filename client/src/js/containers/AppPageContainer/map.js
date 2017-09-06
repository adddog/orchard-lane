import Q from "bluebird"
import Xhr from "xhr-request"

const xhr = Q.promisify(Xhr)

const mapValues = (val, in_min, in_max, out_min, out_max) =>
  (val - in_min) * (out_max - out_min) / (in_max - in_min) + out_min

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

        console.log("svgPlotProgress", svgPlotProgress);

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
  constructor() {
  }

  setModel(model) {
    this._plot = PlotPoints(model.DataObject.mapData)
    const onCoinsChanged = model.observable.on(
      "videoId",
      (value, prev) => {
        this.setActiveVideo(value)
      }
    )
    this.setActiveVideo(model.observable.videoId)
  }

  setActiveVideo(id) {
    this._plot.setActive(id)
  }

  getPlotProgress(t) {
    return this._plot.update(t)
  }
}

export default new OrchardLaneMap()
