import { StyleSheet, Dimensions } from 'react-native'
const { height, width } = Dimensions.get('window')

export default StyleSheet.create({
  container: {
    flex: 1
  },
  imageContainer: {
    flex: 2,
    flexDirection: 'column',
    justifyContent: 'flex-start'
  },
  thumbnail: {
    width: 70,
    height: 70,
    borderRadius: 5
  },
  title: {
    fontSize: 14,
    backgroundColor: 'transparent'
  },
  info: {
    backgroundColor: 'transparent',
    color: 'gray',
    fontSize: 12
  },
  btnView: {
    alignSelf: 'flex-end',
    fontSize: 11,
    color: 'darkblue'
  },
  btnViewIcon: {
    fontSize: 11,
    color: 'darkblue'
  },
  indicator: {
    marginTop: 10
  }
})
