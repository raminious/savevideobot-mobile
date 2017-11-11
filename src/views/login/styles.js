import { StyleSheet, Dimensions } from 'react-native'
const { height, width } = Dimensions.get('window')

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  formContainer: {
    flex: 7
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
  forgetPassword: {
    marginTop: 10
  },
  cancel: {
    marginTop: 15
  },
  cancelText: {
    color: '#29252c',
    fontSize: 13
  }
})
