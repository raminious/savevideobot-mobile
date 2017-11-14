import React from 'react'
import { Route, Switch, Redirect, withRouter } from 'react-router-native'
import { connect } from 'react-redux'
import { View, Text, StyleSheet } from 'react-native'
import { Container, Content } from 'native-base'
import AuthenticationLayout from './authentication'
import ApplicationLayout from './application'
import Analytics from '../services/analytics'
import '../utils/android-back-button'
import '../services/version-control'
import '../services/network-monitor'
import '../services/authentication'

class AppContainer extends React.Component {
  constructor(props) {
    super(props)
  }

  componentWillReceiveProps(nextProps) {
    Analytics.handleRouteChange(this.props, nextProps)
  }

  render() {
    const { account } = this.props

    return (
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
  }
}

function mapStateToProps({ account }) {
  return { account }
}

export default withRouter(connect(mapStateToProps)(AppContainer))
