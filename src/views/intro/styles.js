import { StyleSheet, Dimensions } from 'react-native'
const { height, width } = Dimensions.get('window')

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  textContainer: {
    flex: 2,
    marginLeft: width / 20,
    marginRight: width / 10,
    borderRadius: 5
  },
  btnContainer: {
    justifyContent: 'flex-start',
    marginBottom: 50
  },
  title: {
    fontWeight: 'bold',
    color: '#33425b',
    fontSize: 20,
    padding: 15,
    backgroundColor: 'rgba(51, 66, 91, 0.05)',
    lineHeight: 30
  },
  subtitle: {
    fontSize: 14,
    color: '#29252c',
    padding: 15,
    paddingTop: 3,
    backgroundColor: 'rgba(51, 66, 91, 0.05)',
    lineHeight: 22
  },
  button: {
    borderRadius: 3,
    marginLeft: 10
  },
  signup: {
    backgroundColor: '#035BBD'
  }
})
