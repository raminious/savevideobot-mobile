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
    padding: padding
  },
  mediaInfoRow: {
    height: 40,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginBottom: 3
  },
  thumbnail: {
    width: 105,
    height: 105,
    borderRadius: 5,
    resizeMode: 'cover'
  },
  fieldName: {
    height: 20,
    fontSize: 14
  },
  fieldValue: {
    height: 20,
    color: '#262626',
    fontSize: 13
  },
  /* formats */
  formatsContainer: {
    backgroundColor: 'transparent'
  },
  formatsListItem: {
    backgroundColor: 'transparent'
  },
  formatsHeader: {
    paddingTop: 5,
    paddingLeft: padding + 5,
    fontSize: 13,
    color: 'gray'
  },
  noFormat: {
    paddingTop: 2,
    paddingBottom: 6,
    paddingLeft: padding + 3,
    fontSize: 13
  },
  /* download */
  ctaContainer: {
    paddingLeft: padding,
    paddingRight: padding
  }
})
