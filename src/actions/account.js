import { Sentry } from 'react-native-sentry'
import * as types from '../constants/account'
import db from '../database'

export function login(identity) {
  Sentry.setUserContext({
    id: identity.id,
    email: identity.email
  })

  return {
    type: types.LOGIN,
    identity
  }
}

export function logout() {
  db.remove(db.find('User'))

  return {
    type: types.LOGOUT
  }
}
