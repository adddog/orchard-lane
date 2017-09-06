import React, { Component, PropTypes } from "react"
import { isObject, isUndefined, keys, find } from "lodash"
import classnames from "classnames"
import Q from "bluebird"
import Xhr from "xhr-request"
const xhr = Q.promisify(Xhr)
import ThreeScene from "orchard-lane-three"
import MediaPlayer from "orchard-lane-media-player"
import Scene from "./three"
import OrchardLaneMap from "./map"
import Model from "./model"

import styles from "./AppPageContainer.css"

export default class AppPageContainer extends Component {
  static propTypes = {}

  constructor(props) {
    super(props)
  }

  componentDidMount() {

    const ITAG = "133"
    const { ASSET_URL } = process.env

    Model.start().then(DataObject => {

      Model.init({
        videoId: DataObject.videoIds[0],
      })
      OrchardLaneMap.setModel(Model)

      return MediaPlayer(
        DataObject.videoIds.map(id => `${ASSET_URL}${id}_${ITAG}.json`),
        {
          assetUrl: ASSET_URL,
        }
      ).then(({ mediaSource, manifests, addFromReference }) => {

        DataObject.manifests = manifests

        mediaSource.endingSignal.add(() => {})

        let _previousTime = null
        mediaSource.timeUpdateSignal.add(t => {
          if(_previousTime !== t){
            Model.updateValue(
              "plotterProgress",
              OrchardLaneMap.getPlotProgress(t * 1000)
            )
          }
          _previousTime = t
        })

        /*mediaSource.videoWaitingSignal.add(()=>{
          console.log("Waiting");
        })

        mediaSource.videoPausedSignal.add(()=>{
          console.log("videoPausedSignal");
        })*/

        addFromReference(manifests[0], [0, 2])

        this._startScene(mediaSource.el, Model)
      })
      .catch(err=>{
        this._startScene(this.refs.videoEl, Model)
        let _t = 0
        setInterval(()=>{
          const nextPoint = OrchardLaneMap.getPlotProgress(_t)
          if(nextPoint){
          Model.updateValue(
              "plotterProgress",
              nextPoint
            )

          }
          _t += 250
        }, 1000)

      })
    })
    /*const DataObject = {
      videoIds: null,
      plotterPaths: null,
      videoManifests: null,
    }
    Model.setDataObject(DataObject)

    xhr(`json/videos.json`, { json: true }).then(IDS => {
      const ITAG = "133"
      const { ASSET_URL } = process.env

      DataObject.videoIds = IDS
      Model.init({
        videoId: IDS[0],
      })
      OrchardLaneMap.setModel(Model)

      return Q.map(IDS, id =>
        xhr(`json/${id}.json`, {
          json: true,
        }).then(d => {
          d = d.map(p => {
            p.x *= 0.1
            p.y *= 0.1
            return p
          })
          d.shift()
          console.log(d);
          return {
            id: id,
            data: d,
          }
        })
      ).then(plotters => {
        const Plots = {}
        plotters.forEach(
          plot => (Plots[plot.id] = find(plotters, {id:plot.id}).data)
        )
        DataObject.plotterPaths = Plots

        return MediaPlayer(
          IDS.map(id => `${ASSET_URL}${id}_${ITAG}.json`),
          {
            assetUrl: ASSET_URL,
          }
        ).then(({ mediaSource, manifests, addFromReference }) => {
          //document.body.appendChild(mediaSource.el)

          DataObject.manifests = manifests

          mediaSource.endingSignal.add(() => {})

          mediaSource.timeUpdateSignal.add(t => {

            Model.updateValue(
              "plotterProgress",
              OrchardLaneMap.getPlotProgress(t*1000)
            )
          })

          addFromReference(manifests[0], [0, 2])

          Scene(
            ThreeScene(mediaSource.el, this.refs.three, {
              hide: true,
            }),
            Model
          )
        })
      })
    })*/
  }

  _startScene(el, Model){
    Scene(
          ThreeScene(el, this.refs.three, {
            hide: true,
          }),
          Model
        )
  }

  componentDidUpdate() {}

  _render() {
    return (
      <main
        data-ui-ref="AppContentContainer"
        className={classnames(styles.root)}
      >
        <video ref="videoEl" src="orchardlane.mp4"></video>
        <div
          ref="three"
          className={classnames([
            styles.root,
            "u-container full u-flex",
          ])}
          data-ui-ref="AppContent"
        />
      </main>
    )
  }

  render() {
    return this._render()
  }
}
