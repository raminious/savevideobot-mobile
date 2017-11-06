import React from 'react'
import { ListView } from 'react-native'
import { Col, Row, View, Text, ListItem, Left, Right, Body, Radio, CheckBox } from 'native-base'
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

    return (
      <Col>
        <Row size={10}>
          <Text style={styles.formatsHeader}>
            Available qualities ({formats.length}):
          </Text>
        </Row>

        <Row size={90}>
          {
            formats.length > 0 ?
            <ListView
              showsVerticalScrollIndicator
              dataSource={ds.cloneWithRows(formats)}
              renderRow={(format) => (
                <ListItem
                  style={styles.formatsListItem}
                  key={format.id}
                  onPress={() => onChangeFormat(format.id)}
                >
                  <Radio
                    selected={format.id === selectedFormat}
                    onPress={() => onChangeFormat(format.id)}
                  />

                  <Body>
                    <Text>{format.dimension} - {format.ext}</Text>
                  </Body>
                </ListItem>
              )}
            /> :
            <Text style={styles.noFormat}>
              There isn't any additonal quality options to choose.
            </Text>
          }
        </Row>
      </Col>
    )
  }
}
