import React, { Component, PropTypes } from "react"
import { isObject, isUndefined, keys, find } from "lodash"
import classnames from "classnames"
import Q from "bluebird"
import Xhr from "xhr-request"
const xhr = Q.promisify(Xhr)
import ThreeScene from "orchard-lane-three"
import VideoPlayer from "videoPlayer"

import Scene from "threeScene"
import OrchardLane from "./orchard"

import styles from "./AppPageContainer.css"

export default class AppPageContainer extends Component {
  static propTypes = {
    mapData: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const { mapData } = this.props

    //MapDataModel.mapData = mapData

    /*OrchardLaneMap.init()

    VideoPlayer().then(mediaPlayer => {
      const { mediaSource } = mediaPlayer
      this._startScene(mediaSource.el)
    })
    console.log("------");
    console.log(process.env.OFFLINE);
    if (process.env.OFFLINE) {
      this._startScene(this.refs.videoEl)
      let _t = 0
      setInterval(() => {
        const nextPoint = OrchardLaneMap.getPlotProgress(_t)
        if (nextPoint) {
          Model.updateValue("plotterProgress", nextPoint)
        }
        _t += 250
      }, 250)
    }*/
  }

  _startScene(el) {
    Scene(
      ThreeScene(el, this.refs.three, {
        hide: true,
      })
    )
  }

  componentWillReceiveProps(nextProps) {
    const { mapData } = nextProps
    if (
      mapData.get("loadComplete") &&
      mapData.get("loadComplete") !==
        this.props.mapData.get("loadComplete")
    ) {

      OrchardLane.start(mapData)

      VideoPlayer.init().then(mediaPlayer => {
        const { mediaSource } = mediaPlayer


        VideoPlayer.start()

        this._startScene(mediaSource.el)

        this.refs.testVideo.appendChild(mediaSource.el)
      })

      /*console.log("------")
      console.log(process.env.OFFLINE)

      if (process.env.OFFLINE) {
        this._startScene(this.refs.videoEl)
        let _t = 0
        setInterval(() => {
          const nextPoint = OrchardLaneMap.getPlotProgress(_t)
          if (nextPoint) {
            Model.updateValue("plotterProgress", nextPoint)
          }
          _t += 250
        }, 250)
      }*/
    }
  }

  componentDidUpdate() {}

  _render() {
    //<video ref="videoEl" src="orchardlane.mp4" />
    return (
      <main
        data-ui-ref="AppContentContainer"
        className={classnames(styles.root)}
      >

        <div
          ref="three"
          className={classnames([
            styles.root,
            "u-container full u-flex",
          ])}
          data-ui-ref="AppContent"
        />
        <div
          ref="testVideo"
          className={classnames([
            styles.testVideo,
          ])}
        />
      </main>
    )
  }

  render() {
    const { mapData } = this.props
    if (!mapData.get("raw")) return null
    return this._render()
  }
}
