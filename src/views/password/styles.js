import { StyleSheet, Dimensions } from 'react-native'
const { height, width } = Dimensions.get('window')

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  formContainer: {
    flex: 3,
    justifyContent: 'center'
  },
  iconContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  horizontalRow: {
    flexDirection: 'row',
    marginTop: 10,
    marginLeft: 15,
    marginRight: 15
  },
  radioButton: {
    marginRight: 15
  },
  inputPinCode: {
    margin: 10,
    marginLeft: 10,
    borderColor: '#2196f3',
    borderWidth: 1.5,
    borderRadius: 5
  },
  btnSubmit: {
    alignItems: 'center',
    marginLeft: 15,
    marginRight: 15,
    marginTop: 30,
    borderRadius: 5
  }
})
