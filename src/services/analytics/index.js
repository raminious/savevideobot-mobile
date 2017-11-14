import { GoogleAnalyticsTracker, GoogleAnalyticsSettings } from 'react-native-google-analytics-bridge'

const Analytics = {}

// settings
const tracker = new GoogleAnalyticsTracker('UA-109350311-1', {})
GoogleAnalyticsSettings.setDispatchInterval(__DEV__ ? 1 : 60)

Analytics.handleRouteChange = function ({ location }, nextProps) {
  const currentPath = location.pathname
  const nextPath = nextProps.location.pathname

  if (currentPath === nextPath) {
    return false
  }

  Analytics.setScreenView(nextPath)
}

Analytics.setUser = function(email) {
  tracker.setUser(email)
}

Analytics.setScreenView = function(pageName) {
  tracker.trackScreenView(pageName)
}

Analytics.setEvent = function(category, action) {
  tracker.trackEvent(category, action)
}


Analytics.setScreenView('/')
Analytics.setEvent('App', 'Start')

export default Analytics
