import thunk from 'redux-thunk'
import { applyMiddleware, createStore, compose } from 'redux'
import reducer from '../reducers'

const middleware = [ thunk ]

const store = createStore(reducer, compose(
  applyMiddleware(...middleware)
))

export default store
