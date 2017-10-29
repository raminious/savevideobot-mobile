import { StyleSheet, Dimensions } from 'react-native'
const { height, width } = Dimensions.get('window')

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  logoContainer: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formContainer: {
    flex: 7
  },
  input: {
    padding: 3,
    marginLeft: width / 10,
    marginRight: width / 10,
    borderRadius: 4,
    marginBottom: 5
  },
  buttonsContainer: {
    width,
    alignItems: 'center',
    marginTop: 30,
  },
  login: {
    alignItems: 'center',
    marginLeft: 15,
    marginRight: 15,
    marginTop: 30,
    borderRadius: 5
  },
  cancelText: {
    color: '#29252c',
    fontSize: 13
  }
})
