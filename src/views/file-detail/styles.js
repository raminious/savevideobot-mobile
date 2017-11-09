import { StyleSheet, Dimensions } from 'react-native'
const { height, width } = Dimensions.get('window')

export default StyleSheet.create({
  container: {
    flex: 1
  },
  card: {
    flex: 1,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 50
  },
  row: {
    flex: 1,
    flexDirection: 'column',
    marginBottom: 5,
  },
  rowTitle: {
    flex: 1,
    color: '#ED4A6A',
    fontWeight: 'bold',
    fontSize: 14,
  },
  rowDesc: {
    flex: 1,
    color: '#262626',
    fontSize: 13,
    paddingBottom: 5
  },
  bg: {
    position: 'absolute',
    width: undefined,
    height: undefined,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  }
})
