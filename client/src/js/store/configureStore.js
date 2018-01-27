import 'babel-polyfill';
import { applyMiddleware, compose, createStore } from 'redux';
import Reducers from 'reducers';
import createSagaMiddleware from "redux-saga";
import rootSaga from "sagas";
import { createLogger } from 'redux-logger';
import { responsiveStoreEnhancer } from 'redux-responsive';
import { connectRouter, routerMiddleware } from 'connected-react-router'


// TODO check this is only imported for development


const USE_DEV_TOOLS = process.env.DEV

console.log(process.env.NODE_ENV);

/* http://redux.js.org/docs/api/applyMiddleware.html */

export default function configureStore(options = {}) {
  const {
    initialState = {},
      browserHistory = {},
  } = options;

  const middlewares = [];

  const sagaMiddleware = createSagaMiddleware({
        logger: () => {},
    });


  middlewares.push(
    routerMiddleware(browserHistory),
    sagaMiddleware,
  );

  if (USE_DEV_TOOLS) {
    //middlewares.push(createLogger());
  }

  const store = createStore(
    connectRouter(browserHistory)(Reducers),
    initialState,
    compose(
      responsiveStoreEnhancer,
      applyMiddleware(...middlewares))
  )

  sagaMiddleware.run(rootSaga)


  return store;
}
