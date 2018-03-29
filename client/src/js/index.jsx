//import './index.scss';
// import './index.css';
import Detector from 'utils/detector'

import {
    INIT_RUN,
} from 'actions/actionTypes';

import { throttle } from 'lodash'
import React from 'react'
import ReactDOM from 'react-dom'
import injectTapEventPlugin from 'react-tap-event-plugin';

import { calculateResponsiveState } from 'redux-responsive'

import { createStore, combineReducers, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'

import { createBrowserHistory, createHashHistory } from 'history'
import { ConnectedRouter } from 'connected-react-router/immutable'

import {
  syncHistoryWithStore,
} from 'react-router-redux'

import configureStore from 'store/configureStore'

import { Router } from 'react-router-dom'

import AppPageMediator from 'mediators/AppPageMediator';

// Configure store and routes
const browserHistory = createBrowserHistory();
const store = configureStore({
  browserHistory,
});

const throttleResize = throttle(() => {
}, 400)
window.addEventListener('resize', () => throttleResize())

store.dispatch({type: INIT_RUN})

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={browserHistory}>
      <AppPageMediator/>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('app')
)
