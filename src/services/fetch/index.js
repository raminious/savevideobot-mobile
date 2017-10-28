import SuperAgent from 'superagent'
import { NetInfo, Platform } from 'react-native'
import store from '../../store'
import config from '../../config'
import App from '../../../package.json'

export default class Fetch {
  constructor(options = {}) {
    this._baseUrl = config.api.url
  }

  _create(method, endpoint) {
    const { account } = store.getState()
    account.access_token = 'TPCYIcQEHctu1fcv6m8pQjFw6+0lVzVw'
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

    // agent.on('error', e => {
    //   console.log(e.response)
    // })

    return agent
  }

  async checkInternetConnection() {
    const isConnected = await NetInfo.isConnected.fetch()
    return isConnected
  }

  get(endpoint) {
    return this._create('get', endpoint)
  }

  post(endpoint) {
    return this._create('post', endpoint)
  }
}
