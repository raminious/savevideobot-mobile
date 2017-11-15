import { Sentry } from 'react-native-sentry'
import * as types from '../constants/account'
import db from '../database'
import Analytics from '../services/analytics'

function setUserContexts(identity) {
  // set sentry user
  if (!__DEV__) {
    Sentry.setUserContext({
      id: identity.id,
      email: identity.email
    })
  }

  // set google analytics user
  Analytics.setUser(identity.email)
}

export function setUser(identity) {
  setUserContexts(identity)

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
    email_confirmed: user.email_confirmed,
    telegram_id: user.telegram_id,
    access_token: user.access_token,
    subscription: user.subscription
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
