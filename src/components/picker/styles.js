import { StyleSheet, Dimensions } from 'react-native'
const { height, width } = Dimensions.get('window')

export default StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  container: {
    flex: width > height ? 7 : 10,
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    marginLeft: width / 10,
    marginRight: width / 10,
    marginTop: height / 5,
    marginBottom: 5,
    borderRadius: 8,
  },
  section: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    padding: 16,
  },
  sectionText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  option: {
    padding: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
  },
  optionText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    color: 'rgba(0, 0, 0, 0.8)',
  },
  cancelContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 8,
    marginLeft: width / 10,
    marginRight: width / 10,
    marginTop: 0,
    marginBottom: height / 5,
    padding: 8,
  },
  cancelText: {
    textAlign: 'center',
    color: '#333',
    fontSize: 16,
  }
})
