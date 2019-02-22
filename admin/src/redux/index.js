import { routerMiddleware } from 'connected-react-router'
import { applyMiddleware, createStore } from 'redux'
import logger from 'redux-logger'
import createSagaMiddleware from 'redux-saga'
import thunk from 'redux-thunk'

import history from '../history'
import reducer from './reducer'
import saga from './saga'

// import { init as initAuth } from '../ducks/auth'
const sagaMiddleware = createSagaMiddleware()

const enhancer = applyMiddleware(
  thunk,
  sagaMiddleware,
  routerMiddleware(history),
  logger
)

const store = createStore(reducer, enhancer)

//sagaMiddleware.run(authSaga)
//sagaMiddleware.run(peopleSaga)
sagaMiddleware.run(saga)

// initAuth(store)

//dev only
window.store = store

export default store
