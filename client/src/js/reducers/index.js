import { combineReducers } from 'redux';
import config from './config';
import mapData from './mapData';
import { createResponsiveStateReducer } from 'redux-responsive';

const dashApp = combineReducers({
  config,
  mapData,
  browser: createResponsiveStateReducer({
    mobile: 360,
    phablet: 540,
    tablet: 768,
    tabletH: 1024,
    desktop: 1280,
    desktopM: 1440,
    desktopL: 1680,
    desktopXL: 1920,
  }, {
    extraFields: () => ({
      width: window.innerWidth,
      height: window.innerHeight,
    }),
  }),
});

export default dashApp;
