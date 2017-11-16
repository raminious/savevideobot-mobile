import { Alert } from 'react-native'
import { Toast } from 'native-base'
import Telegram from '../../api/telegram'

export default function(routerHistory, user, message) {
  if (!user.telegram_id) {
    return Alert.alert(
      'Telegram connect',
      'Your account does not connected to Telegram yet. would you like to connect it now ?',
      [
        {text: 'Later', onPress: () => null, style: 'cancel'},
        {text: 'Yes, Connect', onPress: () => routerHistory.push('/settings/telegram/integration')},
      ],
      { cancelable: false }
    )
  }

  Telegram.sendCommand(user.telegram_id, message)

  Alert.alert(
    'Message Sent',
    'The request has been sent to your Telegram messenger',
    [ {text: 'Ok', onPress: () => null}]
  )
}
