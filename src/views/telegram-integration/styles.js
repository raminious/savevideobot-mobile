import { StyleSheet, Dimensions } from 'react-native'
const { height, width } = Dimensions.get('window')

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  logoContainer: {
    flex: 1.5,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  description: {
    flex: 1,
    justifyContent: 'center',
    padding: 10
  },
  descriptionText: {
    fontSize: 14,
    color: '#262626',
    marginBottom: 5
  },
  li: {
    marginTop: 3,
    fontSize: 13,
    color: '#262626'
  },
  descriptionManual: {
    flex: 1,
    padding: 10
  },
  inputManual: {
    marginTop: 10
  },
  btnIntegrate: {
    marginTop: 20
  },
  btnCheckManually: {
    marginTop: 5
  }
})
