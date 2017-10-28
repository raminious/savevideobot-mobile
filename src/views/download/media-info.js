import React from 'react'
import { View, Text } from 'native-base'
import { Image } from 'react-native'
import moment from 'moment'
import 'moment-duration-format'
import styles from './styles'

function getTitle(title = '', max = 40) {
  return title.length <= max ?
    title :
    title.substr(0, max - 5).trim() + '...' + title.substr(-10).trim()
}

export default ({
  download,
  thumbnail
}) => (
  <View style={styles.mediaInfoContainer}>
    <View style={styles.thumbnailContainer}>
      {
        thumbnail &&
        <Image
          style={styles.thumbnail}
          source={{ uri: thumbnail.url }}
        />
      }
    </View>

    <View style={styles.fieldsContainer}>
      <View style={styles.mediaInfoRow}>
        <Text style={styles.fieldName}>
          Name
        </Text>
        <Text style={styles.fieldValue}>
          {getTitle(download.title)}
        </Text>
      </View>

      {
        ~~download.duration > 0 &&
        <View style={styles.mediaInfoRow}>
          <Text style={styles.fieldName}>
            Duration
          </Text>
          <Text style={styles.fieldValue}>
            {
              moment.duration(~~download.duration, 'seconds')
              .format('h:mm:ss[s]', { forceLength: true })
            }
          </Text>
        </View>
      }

    </View>
 </View>
)
