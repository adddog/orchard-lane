import React, { Component, PropTypes } from "react"
import { isObject, isUndefined, keys,noop, find } from "lodash"
import classnames from "classnames"
import Q from "bluebird"
import Xhr from "xhr-request"
const xhr = Q.promisify(Xhr)
//import ThreeScene from "orchard-lane-three"
const ThreeScene = noop
import VideoPlayer from "videoPlayer"

import Scene from "threeScene"
import OrchardLaneModels from "./orchard"

import styles from "./AppPageContainer.css"

export default class AppPageContainer extends Component {
  static propTypes = {
    general: PropTypes.object.isRequired,
    config: PropTypes.object.isRequired,
    videoModel: PropTypes.object.isRequired,
    mapData: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props)
  }

  _startScene(el) {
    const { config } = this.props
    Scene(
      ThreeScene(el, this.refs.three, {
        hide: config.get("hideVideo"),
      })
    )
  }

  getOrchardLaneModelProps(props){
    return {
      updatePlaybackModel: props.updatePlaybackModel,
      mapData: props.mapData,
      videoModel: props.videoModel,
    }
  }

  componentWillReceiveProps(nextProps) {
    const { general, dispatch } = nextProps
    console.log("---------------------------------------");
    console.log(nextProps);
    console.log("---------------------------------------");

    if (
      general.get("loadComplete") &&
      general.get("loadComplete") !==
        this.props.general.get("loadComplete")
    ) {

      OrchardLaneModels.start(this.getOrchardLaneModelProps(nextProps), dispatch)

      const mediaPlayer = new VideoPlayer()

      if (this.props.config.get("debug")) {
        console.log(this.refs);
        //this.refs.testVideo.appendChild(mediaPlayer.mediaSource.el)
        document.body.appendChild(mediaPlayer.mediaSource.el)
      }

      //this._startScene(mediaPlayer.mediaSource.el)

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
    } else {
      OrchardLaneModels.update(nextProps)
    }
  }
  shouldComponentUpdate(nextProps) {
    const { general, dispatch } = nextProps


    return general.get("loadComplete") !==
        this.props.general.get("loadComplete")

    return (
      nextProps.mapData.get("loadComplete") !==
      this.props.mapData.get("loadComplete")
    )
  }

  componentDidUpdate() {}

  _render() {
    //<video ref="videoEl" src="orchardlaneModels.mp4" />
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
          className={classnames([styles.testVideo])}
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
