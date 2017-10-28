import React from 'react'
import { ListView } from 'react-native'
import { View, Text, ListItem, Left, Right, Body, Radio, CheckBox } from 'native-base'
import styles from './styles'

export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      ds: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2
      })
    }
  }

  render() {
    const { formats, selectedFormat, onChangeFormat } = this.props
    const { ds } = this.state

    if (formats.length === 0) {
      return false
    }

    return (
      <View style={styles.formatsContainer}>
        <View>
          <Text style={styles.formatsHeader}>
            Available formats ({formats.length}):
          </Text>
        </View>

        <View>
          <ListView
            showsVerticalScrollIndicator
            dataSource={ds.cloneWithRows(formats)}
            renderRow={(format) => (
              <ListItem
                style={styles.formatsListItem}
                key={format.id}
                onPress={() => onChangeFormat(format.id)}
              >
                <CheckBox
                  checked={format.id === selectedFormat}
                  onPress={() => onChangeFormat(format.id)}
                />

                <Body>
                  <Text>{format.dimension} - {format.ext}</Text>
                </Body>
              </ListItem>
            )}
          />
        </View>
      </View>
    )
  }
}
