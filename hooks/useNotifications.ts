import { useEffect } from 'react';
import { useCourseStore } from '../store/courseStore';
import { usePreferenceStore } from '../store/preferenceStore';
import { requestPermissions, scheduleBookmarkNotification, scheduleReminderNotification, cancelReminder, setupNotificationHandler } from '../utils/notifications';

export const useNotifications = () => {
  const { bookmarks, loadBookmarks } = useCourseStore();
  const { lastOpenedAt, updateLastOpened, loadPreferences } = usePreferenceStore();

  // Initial setup on app mount
  useEffect(() => {
    (async () => {
      await requestPermissions();
      await loadBookmarks();
      await loadPreferences();
      setupNotificationHandler();
    })();
  }, []);

  // Watch bookmark count to trigger milestone notification
  useEffect(() => {
    if (bookmarks.length === 5) {
      scheduleBookmarkNotification();
    }
  }, [bookmarks.length]);

  // On app start: check lastOpenedAt and schedule reminder if needed
  useEffect(() => {
    (async () => {
      if (lastOpenedAt) {
        const last = new Date(lastOpenedAt);
        const diffMs = new Date().getTime() - last.getTime();
        const hours = diffMs / (1000 * 60 * 60);

        if (hours >= 24) {
          await scheduleReminderNotification();
        } else {
          await cancelReminder();
        }
      } else {
        // No record yet – schedule the first reminder
        await scheduleReminderNotification();
      }

      await updateLastOpened();
    })();
  }, [lastOpenedAt]);
};

