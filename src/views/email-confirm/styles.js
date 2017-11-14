import { StyleSheet, Dimensions } from 'react-native'
const { height, width } = Dimensions.get('window')

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  formContainer: {
    flex: 3
  },
  iconContainer: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center'
  },
  inputVerifyCode: {
    margin: 10,
    marginLeft: 15,
    marginRight: 15,
    borderColor: '#2196f3',
    borderWidth: 1.5,
    borderRadius: 5
  },
  verifyCode: {
    textAlign: 'center',
    fontSize: 22,
    color: '#2196f3'
  },
  btnSubmit: {
    alignItems: 'center',
    marginLeft: 15,
    marginRight: 15,
    borderRadius: 5
  }
})
