import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useAuthStore } from '../../store/authStore';
import { useCourseStore } from '../../store/courseStore';
import { clearAll as clearAsyncStorage } from '../../utils/asyncStorage';
import { removeSecureItem } from '../../utils/secureStorage';
import { SECURE_KEYS } from '../../utils/constants';
import { useRouter } from 'expo-router';
import { loadEnrolledCourses } from '../../utils/enrolledCourses';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { bookmarks, loadBookmarks } = useCourseStore();
  const [enrolledCount, setEnrolledCount] = useState(0);

  const refreshCounts = useCallback(async () => {
    try {
      const enrolled = await loadEnrolledCourses();
      setEnrolledCount(enrolled.length);
    } catch {
      setEnrolledCount(0);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadBookmarks();
      refreshCounts();
    }, [loadBookmarks, refreshCounts])
  );

  const initials = useMemo(() => {
    const name = user?.fullName || '';
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    const first = parts[0]?.[0] ?? '';
    const second = parts[1]?.[0] ?? '';
    return (first + second).toUpperCase();
  }, [user?.fullName]);

  const handleLogout = async () => {
    try {
      await logout();
      await clearAsyncStorage();
      await removeSecureItem(SECURE_KEYS.TOKEN_KEY);
      await removeSecureItem(SECURE_KEYS.USER_KEY);
      router.replace('/(auth)/login');
    } catch {
      router.replace('/(auth)/login');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0F172A]" edges={['top']}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-white text-3xl font-bold mb-6">Profile</Text>

        {/* Profile Card */}
        <View className="bg-[#020617] rounded-3xl p-5 mb-5 border border-[#1E293B] shadow-lg shadow-black/40">
          <View className="flex-row items-center">
            <View className="w-16 h-16 rounded-full bg-[#1D4ED8] items-center justify-center mr-4">
              <Text className="text-white text-2xl font-bold">{initials}</Text>
            </View>
            <View className="flex-1">
              <Text className="text-white text-lg font-semibold" numberOfLines={1}>
                {user?.fullName || 'Learner'}
              </Text>
              <Text className="text-gray-400 text-sm" numberOfLines={1}>
                {user?.email || 'No email available'}
              </Text>
            </View>
          </View>
        </View>

        {/* Stats Card */}
        <View className="bg-[#020617] rounded-3xl p-5 mb-5 border border-[#1E293B]">
          <Text className="text-gray-400 text-xs font-semibold mb-3 uppercase tracking-widest">
            Your Stats
          </Text>
          <View className="flex-row justify-between">
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => router.push('/bookmarks')}
              className="flex-1 mr-2 bg-[#0B1120] rounded-2xl px-4 py-3 border border-[#1E293B]"
            >
              <Text className="text-gray-400 text-xs mb-1">Bookmarked</Text>
              <Text className="text-white text-2xl font-bold">{bookmarks.length}</Text>
              <Text className="text-[#6366F1] text-xs mt-2 font-semibold">View list →</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => router.push('/enrolled')}
              className="flex-1 ml-2 bg-[#0B1120] rounded-2xl px-4 py-3 border border-[#1E293B]"
            >
              <Text className="text-gray-400 text-xs mb-1">Enrolled</Text>
              <Text className="text-white text-2xl font-bold">{enrolledCount}</Text>
              <Text className="text-[#6366F1] text-xs mt-2 font-semibold">View list →</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Account Card */}
        <View className="bg-[#020617] rounded-3xl p-5 border border-[#1E293B] mb-6">
          <Text className="text-gray-400 text-xs font-semibold mb-3 uppercase tracking-widest">
            Account
          </Text>
          <View className="mt-2">
            <View className="flex-row justify-between items-center py-3">
              <Text className="text-gray-300 text-sm">Status</Text>
              <Text className="text-emerald-400 text-xs font-semibold px-2 py-1 rounded-full bg-emerald-500/10">
                {user ? 'Signed in' : 'Guest'}
              </Text>
            </View>
          </View>
        </View>

        {/* Spacer */}
        <View className="flex-1" />

        {/* Logout Button */}
        <TouchableOpacity
          onPress={handleLogout}
          className="mt-4 bg-red-500/10 border border-red-500/40 rounded-2xl py-4 items-center justify-center"
          activeOpacity={0.8}
        >
          <Text className="text-red-400 font-semibold text-base">Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

