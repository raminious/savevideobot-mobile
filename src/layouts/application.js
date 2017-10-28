import React from 'react'
import { Route, Switch, Redirect, withRouter } from 'react-router-native'
import { connect } from 'react-redux'
import { StyleSheet } from 'react-native'
import { Container, View, Content } from 'native-base'
import TabsNavigation from './navigation'
import ExploreView from '../views/explore'
import DownloadView from '../views/download'
import ProgressView from '../views/progress'
import FilesView from '../views/files'
import FileDetailView from '../views/file-detail'
import SettingsView from '../views/settings'

const ApplicationContainer = ({ location }) => {
  return (
    <Container>
      <View style={styles.mainContent}>
        <Route exact path="/" component={ExploreView} />
        <Route exact path="/download" component={DownloadView} />
        <Route exact path="/progress" component={ProgressView} />
        <Route exact path="/files" component={FilesView} />
        <Route exact path="/files/:id" component={FileDetailView} />
        <Route exact path="/settings" component={SettingsView} />
      </View>

      <TabsNavigation
        location={location}
      />
    </Container>
  )
}

const styles = StyleSheet.create({
  mainContent: {
    flex: 1
  }
})

export default ApplicationContainer
