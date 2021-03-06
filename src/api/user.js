import db from '../database'
import Fetch from '../services/fetch'

const User = {}

/**
 *
 */
User.getIdentity = function() {
  const user = db.find('User')

  if (user.length === 1) {
    const identity = user[0]

    return {
      id: identity.id,
      email: identity.email,
      access_token: identity.access_token,
      name: identity.name,
      username: identity.username,
      telegram_id: identity.telegram_id,
      subscription: identity.subscription
    }
  }

  return null
}

/**
 *
 */
User.signin = async function(email, password, terminateOtherSessions = false) {
  try {
    const response = await new Fetch()
      .post('/user/access-token')
      .send({ method: 'credential' })
      .send({ email, password, terminateOtherSessions })

    return response.body
  } catch(e) {
    throw e
  }
}

/**
 *
 */
User.signout = async function(token) {
  try {
    const response = await new Fetch()
      .post('/user/remove-token')
      .send({ token })

    return response.body
  } catch(e) {
    throw e
  }
}


/**
 *
 */
User.signup = async function(name, email, password) {
  try {
    const response = await new Fetch()
      .post('/user/signup')
      .send({ name, email, password })

    return response.body
  } catch(e) {
    throw e
  }
}

/**
 *
 */
User.forgetPassword = async function(email, sendTo) {
  try {
    const response = await new Fetch()
      .post('/user/password/forget')
      .send({ email, sendTo })

    return response.body
  } catch(e) {
    throw e
  }
}

/**
 *
 */
User.resetPassword = async function(userId, pinCode, newPassword) {
  try {
    const response = await new Fetch()
      .post('/user/password/reset')
      .send({ userId, pinCode, newPassword })

    return response.body
  } catch(e) {
    throw e
  }
}

/**
 *
 */
User.changePassword = async function(currentPassword, newPassword) {
  try {
    const response = await new Fetch()
      .post('/user/password/change')
      .send({ currentPassword, newPassword })

    return response.body
  } catch(e) {
    throw e
  }
}

/**
 *
 */
User.sendConfirmationEmail = async function() {
  try {
    const response = await new Fetch()
      .post('/user/email/send-verification')

    return response.body
  } catch(e) {
    throw e
  }
}

/**
 *
 */
User.verifyEmail = async function(code) {
  try {
    const response = await new Fetch()
      .post('/user/email/verify')
      .send({ code })

    return response.body
  } catch(e) {
    throw e
  }
}

/**
 *
 */
User.getInfo = async function(access_token = null) {
  try {
    const response = await new Fetch()
      .get('/user/info')
      .retry(2)

    return response.body
  } catch(e) {
    throw e
  }
}

export default User
