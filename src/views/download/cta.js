import React from 'react'
import { Row, Col, View, Button, Icon, Text } from 'native-base'
import styles from './styles'

function getDownloadCaption(working, waitForDownload) {
  if (waitForDownload !== 0) {
    return `Wait For ${waitForDownload}`
  }

  return working ? 'Starting ...' : 'Start Downloading'
}

export default ({
  working,
  waitForDownload,
  startProcessing,
  sendToTelegram
}) => (
  <Col>
    <Row>
      <Button
        iconLeft
        info
        full
        medium
        disabled={working}
        style={{ flex: 1 }}
        onPress={startProcessing}
      >
        <Icon name="download" style={{ fontSize: 17 }} />
        <Text style={{ fontSize: 12 }}>
          {getDownloadCaption(working, waitForDownload)}
        </Text>
      </Button>
    </Row>

    <Row>
      <Button
        iconLeft
        info
        bordered
        full
        small
        disabled={working || waitForDownload !== 0}
        style={{ flex: 1 }}
        onPress={sendToTelegram}
      >
        <Icon name="send" style={{ fontSize: 17 }} />
        <Text style={{ fontSize: 12 }}>
          Send this file to my Telegram
        </Text>
      </Button>
    </Row>
  </Col>
)
