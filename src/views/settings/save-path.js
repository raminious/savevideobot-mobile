import React from 'react'
import { View, Icon, ListItem, Body, Left, Right, Text } from 'native-base'
import RNFetchBlob from 'react-native-fetch-blob'
import _ from 'underscore'
import { Picker, PickerSection, PickerOption } from '../../components/picker'
import db from '../../database'

export default class extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      showPicker: false,
      hasSDCard: RNFetchBlob.fs.dirs.SDCardDir != null
    }
  }

  componentDidMount() {
  }

  showPicker(display) {
    this.setState({
      showPicker: display
    })
  }

  onPathChange(value) {
    db.save('Setting', {
      name: 'download-path',
      value
    }, true)

    this.showPicker(false)
  }

  getDownloadPath() {
    const dirs = RNFetchBlob.fs.dirs
    const setting = db.find('Setting').filtered('name = "download-path"')

    const path = (setting.length === 1) ? setting[0].value : 'DownloadDir'
    return path.replace('Dir', '')
  }

  render() {
    const { hasSDCard, showPicker } = this.state
    const downloadPath = this.getDownloadPath()

    return (
      <View>
        <ListItem icon>
          <Left>
            <Icon name="download" />
          </Left>
          <Body>
            <Text note>Downloads path</Text>
          </Body>

          <Right>
            <Text
              note
              onPress={() => this.showPicker(true)}
            >
              {downloadPath}/savevideobot
            </Text>
          </Right>
        </ListItem>

        <Picker
          show={showPicker}
          defaultSelected={{ section_0: `${downloadPath}Dir` }}
          onClose={() => this.showPicker(false)}
        >
          <PickerSection
            title="Select download path"
            onChange={(value) => this.onPathChange(value)}
          >
            <PickerOption value='DownloadDir'>
              Internal card (Downloads folder)
            </PickerOption>

            {
              hasSDCard &&
              <PickerOption value='SDCardDir'>
                External card
              </PickerOption>
            }
          </PickerSection>
        </Picker>
      </View>
    )
  }
}
