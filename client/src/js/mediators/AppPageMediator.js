import React from "react"
import AppPageContainer from "containers/AppPageContainer/AppPageContainer"
import {
  compose,
  setDisplayName,
  onlyUpdateForPropTypes,
  withHandlers,
} from "recompose"
import { connect } from "react-redux"
import { find, omit, noop } from "lodash"
import { bindActionCreators } from "redux"
import {
  updatePlaybackModel,
  updatePlaylistModel,
  incrementPlaylistModel,
} from "actions/videoModel"
import {
  getActivePlaybackModel,
} from "selectors/videoModel"
import { withRouter } from "react-router-dom"

const makeGUI = process.env.DEV
  ? dispatch => {
      /* const dat = require("dat.gui/build/dat.gui.js")
          const boundActions = bindActionCreators({
              nextVideoInPlaylist: incrementPlaylistModel,
          }, dispatch)
          const o = {
              nextVideoInPlaylist: () =>
                  boundActions.nextVideoInPlaylist(),
          }
          const gui = new dat.GUI()
          gui.add(o, "nextVideoInPlaylist")*/
    }
  : noop

const mapStateToProps = () => {
  return (state, ownProps) => {
    return {
      activePlaybackModel: getActivePlaybackModel(state),
      general: state.general,
      config: state.config,
      videoModel: state.videoModel,
      mapData: state.mapData,
      ...ownProps,
    }
  }
}

const mapDispatchToProps = (dispatch, props) => {
  makeGUI(dispatch)
  return {
    dispatch,
    ...bindActionCreators(
      { updatePlaybackModel, updatePlaylistModel },
      dispatch
    ),
  }
}

export default withRouter(
  compose(
    setDisplayName("AppPageContainer"),
    withHandlers({}),
    connect(mapStateToProps, mapDispatchToProps)
  )(AppPageContainer)
)
