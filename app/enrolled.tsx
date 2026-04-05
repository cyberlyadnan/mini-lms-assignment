import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { Image } from 'expo-image';
import { Stack, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CourseWithInstructor } from '../types/course.types';
import { loadEnrolledCourses } from '../utils/enrolledCourses';
import { Header } from '../components/Header';

export default function EnrolledCoursesScreen() {
  const router = useRouter();
  const [courses, setCourses] = useState<CourseWithInstructor[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const list = await loadEnrolledCourses();
      setCourses(list);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  const openCourse = useCallback((course: CourseWithInstructor): void => {
    router.push({
      pathname: '/course/[id]',
      params: {
        id: String(course.id),
        courseData: JSON.stringify(course),
      },
    });
  }, [router]);

  const renderEnrolledItem = useCallback(({ item }: { item: CourseWithInstructor }) => (
    <TouchableOpacity
      onPress={() => openCourse(item)}
      activeOpacity={0.85}
      className="bg-[#1E293B] rounded-2xl mb-3 overflow-hidden border border-[#334155] flex-row"
    >
      <Image
        source={{ uri: item.thumbnail || 'https://via.placeholder.com/120' }}
        className="w-28 h-28"
        style={{ width: 112, height: 112 }}
        contentFit="cover"
      />
      <View className="flex-1 p-3 justify-center">
        <Text className="text-white font-semibold text-base" numberOfLines={2}>
          {item.title}
        </Text>
        <Text className="text-[#6366F1] text-xs mt-1 uppercase">{item.category || 'Course'}</Text>
      </View>
      <View className="justify-center pr-3">
        <Ionicons name="chevron-forward" size={22} color="#64748B" />
      </View>
    </TouchableOpacity>
  ), [openCourse]);

  return (
    <SafeAreaView className="flex-1 bg-[#0F172A]" edges={['top', 'bottom']}>
      <Header title="My courses" />
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#6366F1" />
        </View>
      ) : (
        <FlatList
          data={courses}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 24 }}
          ListEmptyComponent={
            <View className="py-16 px-4 items-center">
              <Ionicons name="school-outline" size={48} color="#64748B" />
              <Text className="text-gray-400 text-center mt-4 text-base leading-6">
                You have not enrolled in any courses yet.{'\n'}Discover courses on the Home tab.
              </Text>
            </View>
          }
          renderItem={renderEnrolledItem}
        />
      )}
    </SafeAreaView>
  );
}
