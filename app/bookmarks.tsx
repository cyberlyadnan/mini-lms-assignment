import React, { useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useCourseStore } from '../store/courseStore';
import { CourseWithInstructor } from '../types/course.types';

export default function BookmarksScreen() {
  const router = useRouter();
  const { bookmarks, loadBookmarks } = useCourseStore();

  useFocusEffect(
    useCallback(() => {
      loadBookmarks();
    }, [loadBookmarks])
  );

  const openCourse = (course: CourseWithInstructor) => {
    router.push({
      pathname: '/course/[id]',
      params: {
        id: String(course.id),
        courseData: JSON.stringify(course),
      },
    });
  };

  return (
    <View className="flex-1 bg-[#0F172A]">
      <Stack.Screen
        options={{
          title: 'Bookmarked',
          headerStyle: { backgroundColor: '#0F172A' },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: { color: '#FFFFFF', fontWeight: '700' },
          headerShadowVisible: false,
          headerBackTitleVisible: false,
        }}
      />
      <SafeAreaView className="flex-1" edges={['bottom']}>
        <FlatList
          data={bookmarks}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 24 }}
          ListEmptyComponent={
            <View className="py-16 px-4 items-center">
              <Ionicons name="bookmark-outline" size={48} color="#64748B" />
              <Text className="text-gray-400 text-center mt-4 text-base leading-6">
                No bookmarks yet.{'\n'}Tap the bookmark icon on a course to save it here.
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => openCourse(item)}
              activeOpacity={0.85}
              className="bg-[#1E293B] rounded-2xl mb-3 overflow-hidden border border-[#334155] flex-row"
            >
              <Image
                source={{ uri: item.thumbnail || 'https://via.placeholder.com/120' }}
                className="w-28 h-28"
                contentFit="cover"
              />
              <View className="flex-1 p-3 justify-center">
                <Text className="text-white font-semibold text-base" numberOfLines={2}>
                  {item.title}
                </Text>
                <Text className="text-gray-500 text-xs mt-1">
                  Saved {item.bookmarkedAt ? new Date(item.bookmarkedAt).toLocaleDateString() : ''}
                </Text>
              </View>
              <View className="justify-center pr-3">
                <Ionicons name="chevron-forward" size={22} color="#64748B" />
              </View>
            </TouchableOpacity>
          )}
        />
      </SafeAreaView>
    </View>
  );
}
