import observable from "proxy-observable"
import Q from "bluebird"
import Xhr from "xhr-request"
const xhr = Q.promisify(Xhr)
import { keys, assign } from "lodash"

class Model {
  constructor() {
    this.DataObject = {
      videoIds: null,
      mapData: null,
      videoManifests: null,
    }
  }

  start() {
    return xhr(`json/map.json`, { json: true }).then(map => {
      this.DataObject.mapData = map
      this.DataObject.videoIds = keys(map)

      return Q.map(this.DataObject.videoIds, id =>
        xhr(`json/${id}.json`, {
          json: true,
        }).then(d => {
          d.nodes.forEach(p => {
            p.x *= 0.2
            p.y *= 0.2
          })
          return {
            id: id,
            data: d,
          }
        })
      ).then(plotters => {
        const Plots = {}
        plotters.forEach(
          plot => (this.DataObject.mapData[plot.id].path = plot.data)
        )

        console.log(this.DataObject);

        return this.DataObject
      })
    })
  }

  init(data) {
    this.observable = observable(
      assign(
        {},
        {
          videoId: "",
          plotterProgress: 0,
        },
        data
      )
    )
  }

  get currentVideoData() {
    return this.DataObject.mapData[this.observable.videoId]
  }

  get currentPlotterPoint() {
    const c = this.currentVideoData
    if (!c) return null
      const plotterProgress= this.observable.plotterProgress
    console.log("plotterProgress",plotterProgress);
    const index =
      Math.floor((c.path.nodes.length-1) *
      plotterProgress)

      console.log("index",index);

    /*let _i
    for (var i = 0; i < c.path.nodes.length; i++) {
      if (c.path.nodes[i] > p) {
        _i = i
        _i = _i < 0 ? 0 : _i
        break
      }
      _i = i
    }

    console.log("c.path.distances.length", c.path.distances.length, "_i", _i);*/
    const o = {
      ...c.path.nodes[index],
    }

    console.log(o);

    o.x += c.x
    o.y += c.y
    return o
  }

  updateValue(key, val) {
    this.observable[key] = val
  }
}

export default new Model()
