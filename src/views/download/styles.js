import { StyleSheet, Dimensions } from 'react-native'
const { height, width } = Dimensions.get('window')

/* variables */
const padding = 10

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  /* media info */
  mediaInfoContainer: {
    flex: 2,
    flexDirection: 'row',
    padding: padding,
    paddingBottom: 0
  },
  mediaInfoRow: {
    marginBottom: 5
  },
  thumbnailContainer: {
    width: 120
  },
  fieldsContainer: {
    width: width - (120 + 20)
  },
  thumbnail: {
    width: 105,
    height: 105,
    borderRadius: 5,
    resizeMode: 'cover'
  },
  fieldName: {
    fontSize: 15
  },
  fieldValue: {
    color: '#262626',
    fontSize: 14
  },
  /* formats */
  formatsContainer: {
    flex: 6,
    backgroundColor: 'transparent'
  },
  formatsListItem: {
    flex: 1,
    backgroundColor: 'transparent'
  },
  formatsHeader: {
    paddingTop: 5,
    paddingBottom: 6,
    paddingLeft: padding + 3,
    color: 'gray'
  },
  noFormat: {
    paddingTop: 2,
    paddingBottom: 6,
    paddingLeft: padding + 3,
    fontSize: 13
  },
  /* download */
  downloadBtnContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: padding,
    paddingRight: padding
  }
})
