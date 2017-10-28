import { StyleSheet, Dimensions } from 'react-native'
const { height, width } = Dimensions.get('window')

export default StyleSheet.create({
  container: {
    flex: 1
  },
  working: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    justifyContent: 'center'
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 5
  },
  title: {
    fontSize: 15,
    backgroundColor: 'transparent'
  },
  type: {
    backgroundColor: 'transparent',
    color: 'gray',
    fontSize: 12
  },
  emptyState: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: height
  },
  emptyListIcon: {
    fontSize: width / 4,
    color: '#33425b',
    marginBottom: 15,
    backgroundColor: 'transparent'
  },
  emptyListText: {
    color: '#33425b',
    backgroundColor: 'transparent',
    fontSize: 12
  }
})
