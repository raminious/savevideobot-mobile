import React from 'react'
import { withRouter } from 'react-router-native'
import { connect } from 'react-redux'
import {
  View,
  Toast,
  Item,
  Text,
  Content,
  InputGroup,
  Input,
  Label,
  Icon,
  Button,
  ListItem,
  Left,
  Right,
  Body
} from 'native-base'
import { Image, ActivityIndicator } from 'react-native'
import { ListView } from 'realm/react-native'
import db from '../../database'
import Thumbnail from '../../services/thumbnail'
import Loading from '../../components/loading'
import EmptyState from './empty-state'
import Header from './header'
import Favortie from './favortie'
import styles from './styles'

class FilesView extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      counts: 0,
      datasource: this.createNewDataSource(),
      loading: true,
      updating: false,
      criteria: {
        title: '',
        only_favorties: false,
        sort_field: 'date_created',
        sort_type: 'desc',
        type: ''
      }
    }
  }

  componentDidMount() {
    this.renderListView()
  }

  /*
   * create new data source
   */
  createNewDataSource() {
    return new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
  }

  /*
   * Convert bytes to human readable size
   */
  bytes(bytes) {
    return `${(bytes / Math.pow(1024, 2)).toFixed(2)} MB`
  }

  /*
   * create list view
   */
  createListView() {
    const { datasource, criteria } = this.state
    const { account } = this.props

    let media = db.find('Media')

    if (media.length > 0) {
      let query = `status = "complete" && user_id = "${account.id}" `

      if (criteria.title.trim().length > 0) {
        query += ` && title BEGINSWITH[c] "${criteria.title}"`
      }

      // filter by favorited
      if (criteria.only_favorties) {
        query += ' && favorite = true'
      }

      // filter by type
      if (criteria.type !== '') {
        query += ` && type = "${criteria.type}"`
      }

      if (query.length > 0) {
        media = media.filtered(query)
      }

      // apply sort type
      media = media.sorted(criteria.sort_field, criteria.sort_type === 'desc')
    }

    this.setState({
      datasource: datasource.cloneWithRowsAndSections([media]),
      counts: media.length,
      loading: false,
      updating: false,
    })
  }

  /*
   * change filter of favorties
   */
  onFilterFavoritesChange(show) {
    this.changeCriteria('only_favorties', show)
  }

  /*
   * change sort field criteria
   */
  onSortFieldChange(field) {
    this.changeCriteria('sort_field', field)
  }

  /*
   * change sort type criteria
   */
  onSortTypeChange(type) {
    this.changeCriteria('sort_type', type)
  }

  /*
   * change filter type of media
   */
  onFilterMediaTypeChange(type) {
    this.changeCriteria('type', type)
  }

  /*
   * change search criteria on text change
   */
  onSearchTitle(title) {
    this.changeCriteria('title', title)
  }

  /*
   * change query criteria
   */
  changeCriteria(field, value) {
    const { criteria } = this.state

    const newCriteria = {
      ...criteria,
      [field]: value
    }

    this.renderListView({
      criteria: newCriteria,
      loading: true
    })
  }

  /*
   * on toggle like
   */
  onToggleLike(id, favorite) {
    db.save('Media', { id, favorite }, true)

    if (!favorite) {
      return false
    }

    this.renderListView({
      updating: true
    })
  }

  /*
   * render listview
   */
  renderListView (state = {}){
    this.setState(state, this.createListView)
  }

  /*
   * trigger on select media
   */
  onSelectRow(item) {
    const { history } = this.props
    history.push(`/files/${item.id}`)
  }

  render() {
    const { loading, updating, counts, criteria } = this.state

    return (
      <View style={styles.container}>
        <Header
          onFilterFavorites={(show) => this.onFilterFavoritesChange(show)}
          onSortFieldChange={(field) => this.onSortFieldChange(field)}
          onSortTypeChange={(field) => this.onSortTypeChange(field)}
          onFilterMediaTypeChange={(field) => this.onFilterMediaTypeChange(field)}
          onSearchTitle={(value) => this.onSearchTitle(value)}
        />

        <EmptyState
          show={!loading && counts === 0}
          criteria={criteria}
        />

        <Loading
          show={loading || updating}
          hideText
        />

        {
          !loading && counts > 0 &&
          <ListView
            dataSource={this.state.datasource}
            enableEmptySections
            renderRow={item => (
              <ListItem
                button
                onPress={() => this.onSelectRow(item)}
              >
                <Left style={{ flex: 1.5 }}>
                  <Image
                    style={styles.thumbnail}
                    source={Thumbnail.loadImage(item)}
                  />
                </Left>

                <Body style={{ flex: 7 }}>
                  <Text
                    style={styles.title}
                    onPress={() => this.onSelectRow(item) }
                  >
                    { item.title }
                  </Text>

                  <Text style={styles.type}>
                    { item.extension } { item.type } - { this.bytes(item.size) }
                  </Text>
                </Body>

                <Right style={{ flex: 1.5 }}>
                  <Favortie
                    id={item.id}
                    selected={item.favorite}
                    onChange={(id, selected) => this.onToggleLike(id, selected)}
                  />
                </Right>
              </ListItem>
            )}
          />
        }
      </View>
    )
  }
}

function mapStateToProps({ account }) {
  return { account }
}

export default withRouter(connect(mapStateToProps)(FilesView))
