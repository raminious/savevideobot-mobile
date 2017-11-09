import { Alert } from 'react-native'
import { Toast } from 'native-base'
import Telegram from '../../api/telegram'

export default function(routerHistory, user, message) {
  if (!user.telegram_id) {
    return Alert.alert(
      'Oops',
      'Your account does not connected to Telegram yet. would you like to connect it now ?',
      [
        {text: 'Later', onPress: () => null, style: 'cancel'},
        {text: 'Yes, Connect', onPress: () => routerHistory.push('/telegram/integration')},
      ],
      { cancelable: false }
    )
  }

  Telegram.sendCommand(user.telegram_id, message)

  Toast.show({
    text: 'The request has been sent',
    position: 'bottom',
    duration: 3000
  })
}
