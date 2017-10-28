import React from 'react'
import { withRouter } from 'react-router-native'
import { connect } from 'react-redux'
import { StyleSheet, TouchableOpacity, Image } from 'react-native'
import { Link } from 'react-router-native'
import { Footer, FooterTab, View, Icon, Text, Badge } from 'native-base'
import _ from 'underscore'

const isActive = (path, tabNames) => {
  return tabNames.some(name => `/${name}` === path)
}

const getIcon = (name, paths, pathname) => {
  const active = isActive(pathname, paths)

  return (
    <Icon
      name={name}
      active={active}
      style={active ?
        { color: '#d35f5f', fontSize: 31 } :
        { color: 'rgb(51, 132, 222)' }
      }
    />
  )
}

const TabLink = (props) => (
  <Link
    component={TouchableOpacity}
    style={styles.navItem}
    to={props.to}
  >
    {props.children}
  </Link>
)

const Navigation = ({ location, progress }) => {
  const { pathname } = location

  return (
    <Footer>
      <FooterTab style={styles.nav}>
        <TabLink to="/settings">
          {getIcon('settings', ['settings'], pathname)}
        </TabLink>

        <TabLink to="/progress">
          <View style={styles.badgeContainer}>
            {
              _.size(progress) > 0 &&
              <View style={styles.badgeView}>
                <Text style={styles.badgeText}>{_.size(progress)}</Text>
              </View>
            }

            {getIcon('download', ['progress'], pathname)}
          </View>
        </TabLink>

        <TabLink to="/">
          <Image source={require('../assets/icons/download.png')} />
        </TabLink>

        <TabLink to="/files">
          {getIcon('albums', ['files'], pathname)}
        </TabLink>

        <TabLink to="/favorites">
          {getIcon('star', ['favorites'], pathname)}
        </TabLink>
      </FooterTab>
    </Footer>
  )
}

const styles = StyleSheet.create({
  nav: {
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingRight: '5%',
    paddingLeft: '5%'
  },
  navItem: {
    minWidth: 30
  },
  badgeContainer: {
    position: 'relative'
  },
  badgeView: {
    position: 'absolute',
    right: 2,
    top: 0,
    minWidth: 17,
    minHeight: 17,
    borderWidth: 0.3,
    borderColor: 'transparent',
    zIndex: 1000,
    backgroundColor: 'red',
    borderRadius: 30
  },
  badgeText: {
    backgroundColor: 'transparent',
    textAlign: 'center',
    color: '#fff',
    fontSize: 10,
    padding: 2
  }
})

function mapStateToProps({ progress }) {
  return { progress }
}

export default withRouter(connect(mapStateToProps)(Navigation))
