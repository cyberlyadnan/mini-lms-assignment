import { Platform } from 'react-native';
import { router } from 'expo-router';

// Safely import expo-notifications to prevent crashes in Expo Go SDK 53+
let Notifications: any = null;
try {
  // We use require to catch the error thrown by expo-notifications when running in Expo Go Android
  Notifications = require('expo-notifications');

  // Configure how notifications are handled when received in foreground
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
} catch (error) {
  // Use console.log to avoid throwing a disruptive yellow screen warning in the app UI
  console.log('Push notifications not available in this environment');
}

export const requestPermissions = async (): Promise<boolean> => {
  try {
    if (!Notifications) return false;

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    return finalStatus === 'granted';
  } catch {
    return false;
  }
};

let reminderNotificationId: string | null = null;

export const scheduleBookmarkNotification = async () => {
  try {
    if (!Notifications) return;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'You have saved 5 courses!',
        body: 'You have saved 5 courses! Ready to start learning?',
        sound: Platform.select({ ios: 'default', android: 'default' }) as any,
        data: {
          type: 'bookmark_milestone',
          screen: '/(tabs)',
        },
      },
      trigger: null, // immediate
    });
  } catch {
    return;
  }
};

export const scheduleReminderNotification = async () => {
  try {
    if (!Notifications) return;

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'We miss you!',
        body: "You haven't opened the app in a while. Your courses are waiting!",
        sound: Platform.select({ ios: 'default', android: 'default' }) as any,
        data: {
          type: 'return_reminder',
          screen: '/(tabs)',
        },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 60 * 60 * 24, // 24 hours from now
        repeats: false,
      },
    });

    reminderNotificationId = id;
  } catch {
    return;
  }
};

export const cancelReminder = async () => {
  try {
    if (!Notifications) return;

    if (reminderNotificationId) {
      await Notifications.cancelScheduledNotificationAsync(reminderNotificationId);
      reminderNotificationId = null;
    }
  } catch {
    return;
  }
};

export const setupNotificationHandler = () => {
  if (!Notifications) return;

  // When the user taps on a notification and the app responds
  Notifications.addNotificationResponseReceivedListener((response: any) => {
    const data = response.notification.request.content.data as {
      type?: string;
      screen?: string;
    };

    if (data?.screen) {
      try {
        router.push(data.screen as any);
      } catch {
        return;
      }
    }
  });
};

