import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

const CHANNEL_ID = 'default';
const CHANNEL_NAME = 'Default';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

async function configureNotificationChannelAsync() {
  if (Platform.OS !== 'android') {
    return;
  }

  await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
    name: CHANNEL_NAME,
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#F27123',
    sound: 'default',
  });
}

export async function requestNotificationPermissionsAsync() {
  await configureNotificationChannelAsync();

  if (!Device.isDevice) {
    return {
      granted: false,
      isPhysicalDevice: false,
      status: 'unavailable',
      message: 'Expo Go notifications should be tested on a physical device.',
    };
  }

  const currentPermission = await Notifications.getPermissionsAsync();
  let finalStatus = currentPermission.status;

  if (finalStatus !== 'granted') {
    const requestedPermission = await Notifications.requestPermissionsAsync({
      ios: {
        allowAlert: true,
        allowBadge: true,
        allowSound: true,
      },
    });

    finalStatus = requestedPermission.status;
  }

  return {
    granted: finalStatus === 'granted',
    isPhysicalDevice: true,
    status: finalStatus,
    message:
      finalStatus === 'granted'
        ? 'Notification permission granted.'
        : 'Notification permission was not granted.',
  };
}

export async function scheduleLocalNotificationAsync(title, message) {
  return Notifications.scheduleNotificationAsync({
    content: {
      title,
      body: message,
      sound: 'default',
      data: {
        title,
        message,
      },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 2,
      repeats: false,
    },
  });
}

export function registerNotificationListeners({
  onNotificationReceived,
  onNotificationResponse,
}) {
  const receivedSubscription = Notifications.addNotificationReceivedListener(
    (notification) => {
      onNotificationReceived?.(notification);
    }
  );

  const responseSubscription =
    Notifications.addNotificationResponseReceivedListener((response) => {
      onNotificationResponse?.(response);
    });

  return () => {
    receivedSubscription.remove();
    responseSubscription.remove();
  };
}