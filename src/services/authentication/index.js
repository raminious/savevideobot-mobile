import store from '../../store'
import User from '../../api/user'
import { login } from '../../actions/account'

const identity = User.getIdentity()

if (identity) {
  store.dispatch(login(identity))
}
