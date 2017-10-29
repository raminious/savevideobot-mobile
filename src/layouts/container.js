import React from 'react'
import { Route, Switch, Redirect, withRouter } from 'react-router-native'
import { connect } from 'react-redux'
import { View, Text, StyleSheet } from 'react-native'
import { Container, Content } from 'native-base'
import AuthenticationLayout from './authentication'
import ApplicationLayout from './application'
import '../utils/android-back-button'
import '../services/network-monitor'
import '../services/authentication'

const AppContainer = ({ account }) => (
  <Switch>
    <Route
      path="/auth"
      component={AuthenticationLayout}
    />

    <Route
      path="/"
      render={(props) => (
        account.isLoggedIn ?
        <ApplicationLayout {...props} /> :
        <Redirect to="/auth" />
      )}
    />
  </Switch>
)

function mapStateToProps({ app, account }) {
  return { app, account }
}

export default withRouter(connect(mapStateToProps)(AppContainer))
