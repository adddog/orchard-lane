import React from 'react';
import AppPageContainer from "containers/AppPageContainer/AppPageContainer";
import { compose, setDisplayName,onlyUpdateForPropTypes, withHandlers } from "recompose";
import { connect } from "react-redux";
import { find, omit } from "lodash";
import { withRouter } from 'react-router-dom'

const mapStateToProps = () => {
    return (state, ownProps) => {
        return {
            ...ownProps,
        };
    };
};

const mapDispatchToProps = (dispatch, props) => ({
});

const mergeProps = (stateProps, dispatchProps, ownProps) => {
    return {
        ...stateProps,
        ...dispatchProps,
        ...ownProps,
    };
};

export default withRouter(compose(
    setDisplayName("AppPageContainer"),
    withHandlers({
    }),
    connect(
        mapStateToProps,
        mapDispatchToProps,
        mergeProps,
    ),
    onlyUpdateForPropTypes,
)(AppPageContainer));
