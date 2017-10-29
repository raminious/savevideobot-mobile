import React from 'react'
import { Route, Switch, withRouter } from 'react-router-native'
import { connect } from 'react-redux'
import { StyleSheet } from 'react-native'
import { Container, View, Text } from 'native-base'
import IntroView from '../views/intro'
import LoginView from '../views/login'
import SignupView from '../views/signup'

const AuthenticationContainer = (props) => {
  return (
    <Container>
      <View style={styles.mainContent}>
        <Route exact path="/auth" component={IntroView} />
        <Route exact path="/auth/login" component={LoginView} />
        <Route exact path="/auth/signup" component={SignupView} />
      </View>
    </Container>
  )
}

const styles = StyleSheet.create({
  mainContent: {
    flex: 1
  }
})

export default AuthenticationContainer
