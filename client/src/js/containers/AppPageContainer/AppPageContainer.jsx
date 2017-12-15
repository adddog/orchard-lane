import React, { Component, PropTypes } from "react"
import { isObject, isUndefined, keys, find , sample} from "lodash"
import classnames from "classnames"
import Q from "bluebird"
import Xhr from "xhr-request"
const xhr = Q.promisify(Xhr)
import ThreeScene from "orchard-lane-three"
import VideoPlayer from "videoPlayer"

import Scene from "threeScene"
import OrchardLaneModels from "./orchard"

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
    const { config } = this.props
    Scene(
      ThreeScene(el, this.refs.three, {
        hide: false
      })
    )
  }

  componentWillReceiveProps(nextProps) {
    const { videoModel, mapData, config, dispatch } = nextProps
    console.log(mapData.get("loadComplete"));
    if (
      mapData.get("loadComplete") &&
      mapData.get("loadComplete") !==
        this.props.mapData.get("loadComplete")
    ) {

      /*OrchardLaneModels.start(
        nextProps,
        dispatch
      )*/

      //const mediaPlayer = new VideoPlayer()

      if (this.props.config.get("debug")) {
      }
        //this.refs.testVideo.appendChild(mediaPlayer.mediaSource.el)

      this._startScene(this.refs.testVideo)

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
      //OrchardLaneModels.update(nextProps)
    }
  }

  componentDidUpdate() {}

  _render() {

    const videoId = sample([
    "C9KF6EdS9-8",
    "RbhnkPS3MDQ",
    "lmiJKfX_DiE",
    "pl2lljkJZqc",
    "yiTHpe33Fy0",
    "rjzEolVYv0M",
    "9ACjSl5XH7k"
  ])

    const url = `https://storage.googleapis.com/orchard-lane/rjzEolVYv0M_137`
    console.log(url);
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
        <video
          src={url}
          style={{"display":"none"}}
          crossOrigin="anonymous"
          autoPlay="true"
          playsInline="true"
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
