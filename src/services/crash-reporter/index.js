import { Sentry, SentryLog } from 'react-native-sentry'
import config from '../../config'

// configure sentry
Sentry
.config(config.sentry.url, {
  captureUnhandledRejections: true
})
.install()

// set default contexts
Sentry.setTagsContext({
  environment: __DEV__ ? 'development' : 'production',
  react: true
})
