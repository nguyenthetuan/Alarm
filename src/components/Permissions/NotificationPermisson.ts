import messaging from '@react-native-firebase/messaging';
import { Platform, PermissionsAndroid } from 'react-native';
import { requestNotifications } from 'react-native-permissions';

export async function notificationPermisson() {
  if (Platform.OS === 'ios') {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) {
      setFCMTokenUser(() => {});
    }
  } else {
    try {
      const OsVer = Platform.constants.Release;
      if (OsVer >= 13) {
        PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );
      }
      setFCMTokenUser(() => {});
    } catch (error) {
      console.log('error', error);
    }
  }
}

export async function setFCMTokenUser(cb) {
  if (true) {
    try {
      await messaging().registerDeviceForRemoteMessages();
      const { isDeviceRegisteredForRemoteMessages } = messaging();
      if (isDeviceRegisteredForRemoteMessages) {
        if (await messaging().hasPermission()) {
          const token = await messaging().getToken();
          if (token) {
            // const response = await setFCMToken(token).unwrap()
            // if (response?.data === 'SUCCESS') {
            //   dispatch(updateSetFCM())
            // }
            cb(token);
            console.log('token', token);
            // onFCMToken(data, () => {});
          }
        }
      }
    } catch (err) {
      console.log('errrrr', err);
    }
  }
}
