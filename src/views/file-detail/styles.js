import { StyleSheet, Dimensions } from 'react-native'
const { height, width } = Dimensions.get('window')

export default StyleSheet.create({
  container: {
    flex: 1
  },
  card: {
    flex: 1,
    marginTop: 10,
    marginLeft: 30,
    marginRight: 30,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#fff'
  },
  headerCard: {
    marginTop: 30
  },
  middleCard: {
    backgroundColor: '#eee'
  },
  footerCard: {
  },
  fieldRow: {
    marginBottom: 10
  },
  fieldValue: {
    fontSize: 14,
    color: '#262626'
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
