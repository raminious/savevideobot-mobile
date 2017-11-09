import PushNotification from 'react-native-push-notification'

PushNotification.configure({
  popInitialNotification: true,
  requestPermissions: true
})

export function sendLocalNotification(options) {
  const data = Object.assign({
    autoCancel: true,
    largeIcon: "ic_launcher",
    smallIcon: "ic_notification",
    color: "blue",
    vibrate: true,
    vibration: 100,
    ongoing: false,
  }, options)

  PushNotification.localNotification(data)
}

export function cancelAllLocalNotifications() {
  PushNotification.cancelAllLocalNotifications()
}
