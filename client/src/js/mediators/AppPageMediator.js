import React from "react"
import AppPageContainer from "containers/AppPageContainer/AppPageContainer"
import {
    compose,
    setDisplayName,
    onlyUpdateForPropTypes,
    withHandlers,
} from "recompose"
import { connect } from "react-redux"
import { find, omit } from "lodash"
import { bindActionCreators } from "redux"
import {
    updatePlaybackModel,
    updatePlaylistModel,
} from "actions/videoModel"
import { withRouter } from "react-router-dom"

const mapStateToProps = () => {
    return (state, ownProps) => {
        return {
            state,
            ...state,
            ...ownProps,
        }
    }
}

const mapDispatchToProps = (dispatch, props) => ({
    dispatch,
    ...bindActionCreators(
        { updatePlaybackModel, updatePlaylistModel },
        dispatch
    ),
})

const mergeProps = (stateProps, dispatchProps, ownProps) => {
    return {
        ...stateProps,
        ...dispatchProps,
        ...ownProps,
    }
}

export default withRouter(
    compose(
        setDisplayName("AppPageContainer"),
        withHandlers({}),
        connect(mapStateToProps, mapDispatchToProps, mergeProps),
        onlyUpdateForPropTypes
    )(AppPageContainer)
)
