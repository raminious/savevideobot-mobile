import { Toast } from 'native-base'
import store from '../../store'
import User from '../../api/user'
import { setUser, updateUserTable, setUserAttributes } from '../../actions/account'

class Authentication {
  constructor() {
    this.login()
  }

  login() {
    const user = User.getIdentity()

    if (!user) {
      return false
    }

    // dispatch
    store.dispatch(setUser(user))

    this.syncUserObject()
  }

  /**
   * try to sync user table with server data if
   * any data has been changed by web/telegram clients
   */
  async syncUserObject() {
    try {
      const user = await User.getInfo()

      // update user table
      updateUserTable(user)

      // dispatch user attributes
      store.dispatch(setUserAttributes(user))
    } catch(e) {}
  }

}

new Authentication()
