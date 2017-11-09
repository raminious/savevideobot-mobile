import React from 'react'
import { Row, Col, View, Text } from 'native-base'
import { Image, Dimensions } from 'react-native'
import moment from 'moment'
import 'moment-duration-format'
import AsyncImage from '../../components/async-image'
import styles from './styles'

const { height, width } = Dimensions.get('window')

function getTitle(title = '', max = 40) {
  return title.length <= max ?
    title :
    title.substr(0, max - 5).trim() + '...' + title.substr(-10).trim()
}

export default ({
  download
}) => (
  <Row style={styles.mediaInfoContainer}>
    <Col style={{ width: 120 }}>
      <AsyncImage
        style={styles.thumbnail}
        media={download}
      />
    </Col>

    <Col style={{ width: width - 130 }}>
      <View style={styles.mediaInfoRow}>
        <Text style={styles.fieldName}>Name</Text>
        <Text style={styles.fieldValue}>{getTitle(download.title)}</Text>
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
    </Col>
  </Row>
)
