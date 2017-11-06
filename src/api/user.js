import db from '../database'
import Fetch from '../services/fetch'

const User = {}

/**
 *
 */
User.getIdentity = function () {
  const user = db.find('User')

  if (user.length === 1) {
    const identity = user[0]

    return {
      id: identity.id,
      name: identity.name,
      username: identity.username,
      email: identity.email,
      telegram_id: identity.telegram_id,
      telegram_bot: identity.telegram_bot,
      access_token: identity.access_token
    }
  }

  return null
}

/**
 *
 */
User.signin = async function (email, password) {
  try {
    const response = await new Fetch()
      .post('/user/access-token')
      .send({ method: 'credential' })
      .send({ email, password })

    return response.body
  } catch(e) {
    throw e
  }
}

/**
 *
 */
User.signup = async function (name, email, password) {
  try {
    const response = await new Fetch()
      .post('/user/signup')
      .send({ name, email, password })

    return response.body
  } catch(e) {
    throw e
  }
}

export default User
