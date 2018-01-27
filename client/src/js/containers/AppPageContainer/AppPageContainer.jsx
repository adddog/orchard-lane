import PropTypes  from "prop-types"
import React, { Component } from "react"
import { isObject, isUndefined, keys,noop, find } from "lodash"
import classnames from "classnames"
import Q from "bluebird"

import OrchardLane from "./orchard"

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

  getOrchardLaneProps(props){
    return {
      updatePlaybackModel: props.updatePlaybackModel,
      activePlaybackModel: props.activePlaybackModel,
      mapData: props.mapData,
      videoModel: props.videoModel,
      containerEl: this.refs.three,
      config: props.config
    }
  }

  componentWillReceiveProps(nextProps) {
    const { general, dispatch } = nextProps
    if (
      general.get("loadComplete") &&
      general.get("loadComplete") !==
        this.props.general.get("loadComplete")
    ) {
      this.orchardLane = new OrchardLane(this.getOrchardLaneProps(nextProps), dispatch)
    } else if(this.orchardLane){
      this.orchardLane.update(this.getOrchardLaneProps(nextProps))
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

  componentDidUpdate() {
    console.log("componentDidUpdate");
  }

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
