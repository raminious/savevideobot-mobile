import { StyleSheet, Dimensions } from 'react-native'
const { height, width } = Dimensions.get('window')

export default StyleSheet.create({
  container: {
    flex: 1
  },
  formContainer: {
    flex: 7,
    justifyContent: 'center'
  },
  input: {
    padding: 3,
    marginLeft: 15,
    marginRight: 15,
    borderRadius: 4,
    marginBottom: 5
  },
  buttonsContainer: {
    width,
    alignItems: 'center',
    marginTop: 30,
  },
  signup: {
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
