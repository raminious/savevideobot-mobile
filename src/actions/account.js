import { Sentry } from 'react-native-sentry'
import * as types from '../constants/account'
import db from '../database'

export function setUser(identity) {
  Sentry.setUserContext({
    id: identity.id,
    email: identity.email
  })

  return {
    type: types.SET_USER,
    identity
  }
}

export function updateUserTable(user) {
  db.save('User', {
    id: user.id,
    name: user.name,
    email: user.email,
    telegram_id: user.telegram_id,
    access_token: user.access_token
  }, true)
}

export function setUserAttributes(attributes) {
  return {
    type: types.SET_USER_ATTRIBUTES,
    attributes
  }
}

export function logout() {
  db.remove(db.find('User'))

  return {
    type: types.LOGOUT
  }
}
