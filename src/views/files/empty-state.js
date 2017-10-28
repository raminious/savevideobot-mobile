import React from 'react'
import { View, Icon, Text } from 'native-base'
import styles from './styles'

export default ({
  show,
  criteria
}) => {
  if (!show) {
    return false
  }

  return (
    <View style={styles.emptyState}>
      <Icon
        name={criteria.only_favorties ? 'star' : 'albums'}
        style={styles.emptyListIcon}
      />
      <Text style={styles.emptyListText}>
        {
          criteria.only_favorties ?
          'You have not any favorited media' :
          'There is no downloaded media'
        }
      </Text>
    </View>
  )
}
