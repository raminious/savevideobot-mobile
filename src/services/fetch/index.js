import SuperAgent from 'superagent'
import { NetInfo, Platform } from 'react-native'
import { Toast } from 'native-base'
import store from '../../store'
import config from '../../config'
import App from '../../../package.json'
import { logout } from '../../actions/account'

export default class Fetch {
  constructor(options = {}) {
    this._baseUrl = config.api.url
  }

  _create(method, endpoint) {
    const { account } = store.getState()

    // const hasConnection = await this.checkInternetConnection()

    // if (hasConnection === false) {
    //   throw new Error('No Internet Connection')
    // }

    const agent = SuperAgent[method](`${this._baseUrl}${endpoint}`)
      .set('Accept', 'application/json')
      .set('access-token', account.access_token)
      .set('app-version', App.version)
      .set('app-platform', 'mobile')
      .set('app-os', Platform.OS)

    agent.on('error', e => this.onError(e))

    return agent
  }

  get(endpoint) {
    return this._create('get', endpoint)
  }

  post(endpoint) {
    return this._create('post', endpoint)
  }

  async checkInternetConnection() {
    return await NetInfo.isConnected.fetch()
  }

  onError(e) {
    if (e.response.status === 401) {
      this.onInvalidAccessToken()
    }
  }

  onInvalidAccessToken() {
    Toast.show({
      text: 'Your login has been expired.',
      position: 'bottom',
      duration: 2500
    })

    store.dispatch(logout())
  }
}
