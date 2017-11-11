import React from 'react'
import { Route, Switch, Redirect, withRouter } from 'react-router-native'
import { connect } from 'react-redux'
import { AppState, StyleSheet } from 'react-native'
import { Container, View, Content } from 'native-base'
import ShareMenu from 'react-native-share-menu'
import TabsNavigation from './navigation'
import ExploreView from '../views/explore'
import DownloadView from '../views/download'
import ProgressView from '../views/progress'
import FilesView from '../views/files'
import FileDetailView from '../views/file-detail'
import SettingsView from '../views/settings'
import CommunityView from '../views/community'
import TelegramIntegrationView from '../views/telegram-integration'
import { setAppState, setSharedLink } from '../actions/app'

class ApplicationContainer extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    // make global binded function for app state listener
    this.stateListener = this.handleAppStateChange.bind(this)

    // listen to app state changes
    AppState.addEventListener('change', this.stateListener)
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.stateListener)
  }

  handleAppStateChange(nextState) {
    const { app } = this.props

    // set app new state
    this.props.setAppState(nextState)

    // handle new link receiving from share menu
    if (nextState === 'active' && nextState !== app.state) {
      ShareMenu.getSharedText((link) => this.onNewSharedLink(link))
    }
  }

  onNewSharedLink(link) {
    if (!link || link.length === 0) {
      return false
    }

    // clear shared text
    ShareMenu.clearSharedText()

    // set redux store
    this.props.setSharedLink(link)

    // navigate to explore view
    this.props.history.push('/')
  }

  render() {
    const { location } = this.props

    return (
      <Container>
        <View style={styles.mainContent}>
          <Route exact path="/" component={ExploreView} />
          <Route exact path="/download" component={DownloadView} />
          <Route exact path="/progress" component={ProgressView} />
          <Route exact path="/files" component={FilesView} />
          <Route exact path="/files/:id" component={FileDetailView} />
          <Route exact path="/settings" component={SettingsView} />
          <Route exact path="/live" component={CommunityView} />
          <Route exact path="/telegram/integration" component={TelegramIntegrationView} />
        </View>

        <TabsNavigation
          location={location}
        />
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  mainContent: {
    flex: 1,
    backgroundColor: '#fff'
  }
})

function mapStateToProps({ app }) {
  return { app }
}

export default withRouter(connect(mapStateToProps, {
  setAppState, setSharedLink
})(ApplicationContainer))
