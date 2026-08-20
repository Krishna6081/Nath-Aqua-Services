import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: false, // Prevents repetitive OS alert banners from interrupting user experience
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export const cancelAllScheduledNotifications = async () => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (e) {
    console.log('Error clearing scheduled notifications:', e);
  }
};

export const registerForPushNotificationsAsync = async (): Promise<string | undefined> => {
  let token;

  // Clear any old scheduled repeat notifications
  await cancelAllScheduledNotifications();

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.DEFAULT,
      lightColor: '#0284c7',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('Permission for push notifications not granted');
    return;
  }

  try {
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log('Expo Push Token:', token);
  } catch (e) {
    console.log('Error getting push token:', e);
  }

  return token;
};

export const sendLocalNotification = async (title: string, body: string) => {
  // Silent in-app trigger
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
      },
      trigger: null, // send immediately once, no recurring schedule
    });
  } catch (e) {
    console.log('Local notification error:', e);
  }
};

