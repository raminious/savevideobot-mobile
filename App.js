import React from 'react'
import { Provider } from 'react-redux'
import { NativeRouter, Route, Link, AndroidBackButton } from 'react-router-native'
import { StyleProvider, Root } from 'native-base'
import getTheme from './theme/components'
import material from './theme/variables/material'
import store from './src/store'
import AppContainer from './src/layouts/container'

export default class extends React.Component {
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
