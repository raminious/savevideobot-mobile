/* eslint import/no-named-default:0 */
import { combineReducers } from 'redux'
import app from './app'
import progress from './progress'
import account from './account'
import download from './download'
import live from './live'

export default combineReducers({
  app,
  account,
  download,
  progress,
  live
})
