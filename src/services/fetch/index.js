import SuperAgent from 'superagent'
import { Alert, NetInfo, Platform } from 'react-native'
import { Toast } from 'native-base'
import store from '../../store'
import config from '../../config'
import App from '../../../package.json'
import { buySubscription, logout } from '../../actions/account'

export default class Fetch {
  constructor(options = {}) {
    const properties = Object.assign({
      server: 'api'
    }, options)

    this._baseUrl = config[properties.server].url
  }

  _create(method, endpoint) {
    const { account } = store.getState()

    const agent = SuperAgent[method](`${this._baseUrl}${endpoint}`)
      .set('Accept', 'application/json')
      .set('access-token', this.access_token || account.access_token)
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
    if (!e.response) {
      return false
    }

    const { status, body } = e.response
    if (status === 401) {
      this.onInvalidAccessToken()
    }

    if (status === 402) {
      this.onPaymentRequired(body)
    }

    if (status === 429) {
      this.onRateLimit(body)
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

  onRateLimit(response) {
    Toast.show({
      text: `You sent too many request, wait for ${response.text}`,
      position: 'bottom',
      buttonText: 'Okay'
    })
  }

  onPaymentRequired(response) {
    const { account } = store.getState()

    Alert.alert(
      'Buy subscription',
      `You should buy subscription to download this file or wait for ${response.text}`,
      [
        { text: 'Wait', onPress: () => null, style: 'cancel' },
        { text: 'Buy subscription',  onPress: () => buySubscription(account.id) }
      ],
      { cancelable: false }
    )
  }
}
