import { StyleSheet, Dimensions } from 'react-native'
const { height, width } = Dimensions.get('window')

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconNoJob: {
    fontSize: width / 4,
    color: '#33425b',
    marginBottom: 15,
  },
  textNoJob: {
    color: '#33425b',
    fontSize: 14
  },
  transparent: {
    backgroundColor: 'transparent',
  },
  ctaButton: {
    padding: 0,
    marginLeft: 10
  },
  ctaIcon: {
    color: '#2196f3'
  },
  percent: {
    marginTop: 5,
    fontSize: 11
  },
  widerList: {
    height: 65
  },
  black: {
    color: 'black'
  },
  green: {
    color: 'green'
  },
  red: {
    color: 'red'
  },
  brown: {
    color: 'brown'
  }
})
