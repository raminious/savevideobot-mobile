import React from 'react'
import { Icon } from 'native-base'
import { TouchableOpacity } from 'react-native'

export default class Favortie extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selected: props.selected
    }
  }

  onToggleLike() {
    const { id, onChange } = this.props
    const selected = !this.state.selected
    this.setState({ selected })

    onChange(id, selected)
  }

  render() {
    const { selected } = this.state

    return (
      <TouchableOpacity
        onPress={() => this.onToggleLike()}
      >
        <Icon
          name="star"
          active={selected}
          style={{
            fontSize: 30,
            backgroundColor: 'transparent',
            color: selected ? 'orange' : '#ccc'
          }}
        />
      </TouchableOpacity>
    )
  }
}
