/* eslint react/no-multi-comp: 0 */
import React from 'react'
import { View, Modal, Text, ScrollView, TouchableOpacity } from 'react-native'
import styles from './styles'

export class Picker extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      selected: {}
    }
  }

  onStateChange(section, value) {
    const { selected } = this.state
    selected[section] = value
    this.setState({ selected }, this.close)
  }

  close() {
    this.props.onClose()
  }

  render() {
    const { cancelText, children, show } = this.props
    const { selected } = this.state

    const sections = React.Children.map(children, (child, key) =>
      React.cloneElement(child, {
        onStateChange: this.onStateChange.bind(this),
        section: `section_${key}`,
        selected: selected[`section_${key}`]
      })
    )

    return (
      <View>
        <Modal
          transparent
          visible={show}
          onRequestClose={this.close}
          animationType={'slide'}
        >
          <View style={styles.overlay}>
            <View style={styles.container}>
              <ScrollView keyboardShouldPersistTaps="always">
                { sections }
              </ScrollView>
            </View>

            <TouchableOpacity
              style={styles.cancelContainer}
              onPress={() => this.close()}
            >
              <Text style={styles.cancelText}>
                { cancelText || 'Cancel' }
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    )
  }
}

export class PickerSection extends React.Component {
  onSelect(value, text){
    const { onStateChange, onChange, section } = this.props
    onStateChange(section, value)

    if (onChange) {
      onChange(value, text)
    }
  }

  render() {
    const { children, selected, title} = this.props

    const options = React.Children.map(children, child =>
      React.cloneElement(child, {
        onSelect: this.onSelect.bind(this),
        isSelected: (child.props.value === selected) || (!selected && child.props.default)
      })
    )

    return (
      <View>
        <View style={styles.section}>
          <Text style={styles.sectionText}>
            { title }
          </Text>
        </View>
        { options }
      </View>
    )
  }
}

export class PickerOption extends React.Component {

  selectItem(value, text) {
    this.props.onSelect(value, text)
  }

  render() {
    const { value, isSelected, children } = this.props

    return (
      <View style={styles.option}>
        <TouchableOpacity
          onPress={() => this.selectItem(value, children)}
        >
          <Text
            style={[
              styles.optionText,
              isSelected ? {color: 'darkblue'} : {}
            ]}
          >
            { children }
          </Text>
        </TouchableOpacity>
      </View>
    )
  }
}
