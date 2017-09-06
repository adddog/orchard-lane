import React, { Component, PropTypes } from 'react';
import Auth from 'modules/Auth';
import classnames from "classnames";
import Util from 'util';
import { Route, Switch } from 'react-router-dom'
import configureRoutes from 'routes/configureRoutes'

export default class AppContentContainer extends Component {

  static propTypes = {

  };

  constructor(props) {
    super(props)
  }

  render() {
    return (
      configureRoutes()
    );
  }
}