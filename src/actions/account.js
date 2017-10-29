import * as types from '../constants/account'
import db from '../database'

export function login(identity) {
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
