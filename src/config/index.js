/* global __DEV__ */

// get dev server based on platform
const devServer = 'http://192.168.1.100:17000'
const domain = __DEV__ ? 'https://192.168.1.100:18000' : 'https://savevideobot.com'
const telegramDevServer = 'http://192.168.1.100:15000/bot/dispatch'

export default {
  sentry: {
    url: 'https://f8bb68c629594f3384371e7ac477cdf3:5c51692b13b647e189c825130cf348d7@sentry.io/240207'
  },
  app: {
    domain: domain
  },
  api: {
    url: __DEV__ ? devServer : `${domain}/api`
  },
  telegram: {
    url: __DEV__ ? telegramDevServer : 'https://savevideobot.com/telegram/dispatch'
  }
}
