import { Alert, Linking, BackHandler } from 'react-native'
import App from '../../api/app'

async function checkForNewVersion() {
  try {
    await App.versionControl()
  } catch(e) {
    if (e.response && e.response.status === 426) {
      showUpdateAlert(e.response)
    }
  }
}

function showUpdateAlert(response) {
  const { body } = response
  const url = body.marketUrl || body.directUrl

  Alert.alert(
    `Upgrade to version ${body.version}`,
    'This update is MANDATORY and you must update the app to be able using SaveVideoBot services',
    [
      {text: 'Exit', onPress: () => BackHandler.exitApp(), style: 'cancel'},
      {text: 'Update App', onPress: () => Linking.openURL(url)}
    ],
    { cancelable: false }
  )
}

checkForNewVersion()
