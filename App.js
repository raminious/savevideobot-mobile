import React from 'react'
import { Provider } from 'react-redux'
import { NativeRouter, Route, Link, AndroidBackButton } from 'react-router-native'
import { StyleProvider, Root } from 'native-base'
import codePush from 'react-native-code-push'
import getTheme from './theme/components'
import material from './theme/variables/material'
import store from './src/store'
import CrashReporter from './src/services/crash-reporter'
import AppContainer from './src/layouts/container'

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <NativeRouter>
          <AndroidBackButton>
            <StyleProvider style={getTheme(material)}>
              <Root>
                <Route path="/" component={AppContainer} />
              </Root>
            </StyleProvider>
          </AndroidBackButton>
        </NativeRouter>
      </Provider>
    )
  }
}

export default codePush({
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
  installMode: codePush.InstallMode.ON_NEXT_RESTART,
  mandatoryInstallMode: codePush.InstallMode.IMMEDIATE
})(App)
