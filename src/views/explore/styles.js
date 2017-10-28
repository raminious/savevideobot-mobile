import { StyleSheet, Dimensions } from 'react-native'
const { height, width } = Dimensions.get('window')

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  urlContainer: {
    flex: 1,
    marginLeft: width / 12,
    marginRight: width / 12,
  },
  mt20: {
    marginTop: height / 20
  }
})
