import React from 'react'
import { Header, View, Body, Button, Title, Text, Left, Right, Icon } from 'native-base'
import SearchBar from './search'
import { Picker, PickerSection, PickerOption } from '../../components/picker'

export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showSearch: false,
      showSort: false,
      showFilter: false,
      showOnlyFavorites: false
    }
  }

  showSearch(state) {
    this.setState({
      showSearch: state
    })
  }

  showSort(state) {
    this.setState({
      showSort: state
    })
  }

  showFilter(state) {
    this.setState({
      showFilter: state
    })
  }

  toggleFavorites() {
    const { onFilterFavorites } = this.props
    const newState = !this.state.showOnlyFavorites

    this.setState({
      showOnlyFavorites: newState
    })

    onFilterFavorites(newState)
  }

  render() {
    const { showSearch, showSort, showOnlyFavorites, showFilter } = this.state
    const {
      onSearchTitle,
      onSortFieldChange,
      onSortTypeChange,
      onFilterMediaTypeChange
    } = this.props

    if (showSearch) {
      return (
        <SearchBar
          onSearch={onSearchTitle}
          onClose={() => this.showSearch(false)}
        />
      )
    }

    return (
      <View>
        <Header rounded>
          <Body>
            <Title>Downloads</Title>
          </Body>

          <Right>
            <Button
              transparent
              onPress={() => this.showSearch(true)}
            >
              <Icon name="search" />
            </Button>

            <Button
              transparent
              onPress={() => this.toggleFavorites()}
            >
              <Icon
                name="star"
                active={showOnlyFavorites}
                style={{ color: showOnlyFavorites ? 'orange' : '#fff' }}
              />
            </Button>

            <Button
              transparent
              onPress={() => this.showFilter(true)}
            >
              <Icon name="funnel" />
            </Button>

            <Button
              transparent
              onPress={() => this.showSort(true)}
            >
              <Icon name="settings" />
            </Button>
          </Right>
        </Header>

        <Picker
          show={showSort}
          onClose={() => this.showSort(false)}
        >
          <PickerSection
            title="Sort by"
            onChange={onSortFieldChange}
          >
            <PickerOption value="title">Title</PickerOption>
            <PickerOption value="date_created" default>Date</PickerOption>
            <PickerOption value="size">Size</PickerOption>
            <PickerOption value="type">Type</PickerOption>
          </PickerSection>

          <PickerSection
            title="Sort type"
            onChange={onSortTypeChange}
          >
            <PickerOption value="desc" default>Descending</PickerOption>
            <PickerOption value="asc">Ascending</PickerOption>
          </PickerSection>
        </Picker>

        <Picker
          show={showFilter}
          onClose={() => this.showFilter(false)}
        >
          <PickerSection
            title="Filter"
            onChange={onFilterMediaTypeChange}
          >
            <PickerOption value="music">Music</PickerOption>
            <PickerOption value="video">Video</PickerOption>
            <PickerOption value="document">Document</PickerOption>
            <PickerOption value="" default>All Files</PickerOption>
          </PickerSection>
        </Picker>
      </View>
    )
  }
}
