import PropTypes  from "prop-types"
import React, { Component } from "react"
import { isObject, isUndefined, keys,noop, find } from "lodash"
import classnames from "classnames"
import Q from "bluebird"

import OrchardLane from "./orchard"

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
      updatePlaylistModel: props.updatePlaylistModel,
      updatePlaybackModel: props.updatePlaybackModel,
      activePlaybackModel: props.activePlaybackModel,
      hotspotFontJSON: props.hotspotFontJSON,
      mapData: props.mapData,
      videoModel: props.videoModel,
      containerEl: this.refs.three,
      config: props.config,
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
  }

  _render() {
    //<video ref="videoEl" src="orchardlane.mp4" />
    return (
      <main
        data-ui-ref="AppContentContainer"
      >
        <div
          ref="three"
          className={classnames([
          ])}
          data-ui-ref="AppContent"
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
