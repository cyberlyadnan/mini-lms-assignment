import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { router } from 'expo-router';

// Configure how notifications are handled when received in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const requestPermissions = async (): Promise<boolean> => {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    return finalStatus === 'granted';
  } catch (error) {
    console.warn('Failed to request notification permissions', error);
    return false;
  }
};

let reminderNotificationId: string | null = null;

export const scheduleBookmarkNotification = async () => {
  try {
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
  } catch (error) {
    console.warn('Failed to schedule bookmark notification', error);
  }
};

export const scheduleReminderNotification = async () => {
  try {
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
  } catch (error) {
    console.warn('Failed to schedule reminder notification', error);
  }
};

export const cancelReminder = async () => {
  try {
    if (reminderNotificationId) {
      await Notifications.cancelScheduledNotificationAsync(reminderNotificationId);
      reminderNotificationId = null;
    }
  } catch (error) {
    console.warn('Failed to cancel reminder notification', error);
  }
};

export const setupNotificationHandler = () => {
  // When the user taps on a notification and the app responds
  Notifications.addNotificationResponseReceivedListener((response) => {
    const data = response.notification.request.content.data as {
      type?: string;
      screen?: string;
    };

    if (data?.screen) {
      try {
        router.push(data.screen as any);
      } catch (error) {
        console.warn('Failed to navigate from notification', error);
      }
    }
  });
};

