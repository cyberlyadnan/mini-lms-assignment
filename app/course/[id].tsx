import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { getItem, saveItem } from '../../utils/asyncStorage';
import { ENROLLED_COURSE_KEY } from '../../utils/constants';
import { enrolledIdsFromRaw } from '../../utils/enrolledCourses';
import { Header } from '../../components/Header';
import { CourseWithInstructor } from '../../types/course.types';

export default function CourseDetailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id, courseData } = useLocalSearchParams<{ id: string, courseData: string }>();
  const [course, setCourse] = useState<CourseWithInstructor | null>(null);
  
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);

  const checkEnrollment = useCallback(async (): Promise<void> => {
    try {
      const raw = await getItem<unknown[]>(ENROLLED_COURSE_KEY) || [];
      const enrolledIds = enrolledIdsFromRaw(raw);
      if (id && enrolledIds.includes(String(id))) {
        setIsEnrolled(true);
      }
    } catch {
      setIsEnrolled(false);
    }
  }, [id]);

  useEffect(() => {
    if (courseData) {
      try {
        const parsed = JSON.parse(courseData);
        setCourse(parsed);
      } catch {
        setCourse(null);
      }
    }
    void checkEnrollment();
  }, [courseData, checkEnrollment]);

  const handleEnroll = (): void => {
    if (!id || isEnrolled || !course) return;
    const snapshot = course;
    setIsEnrolling(true);

    setTimeout(async () => {
      setIsEnrolling(false);
      setIsEnrolled(true);

      try {
        const raw = await getItem<unknown[]>(ENROLLED_COURSE_KEY) || [];
        const ids = enrolledIdsFromRaw(raw);
        const idStr = String(id);
        if (ids.includes(idStr)) return;

        const next = raw.filter((entry) => {
          if (typeof entry === 'string') return entry !== idStr;
          return String((entry as { id: number }).id) !== idStr;
        });
        await saveItem(ENROLLED_COURSE_KEY, [...next, snapshot]);
      } catch {
        Alert.alert('Enrollment Failed', 'Could not save your enrollment. Please try again.');
        setIsEnrolled(false);
      }
    }, 1500);
  };

  const handleViewContent = () => {
    if (!course) return;
    router.push({
      pathname: '/webview',
      params: { 
        title: course.title,
        description: course.description,
        instructorName: `${course.instructor?.name?.first || 'Unknown'} ${course.instructor?.name?.last || ''}`
      }
    });
  };

  if (!course) {
    return (
      <View className="flex-1 bg-[#0F172A] justify-center items-center">
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#0F172A]">
      <Header 
        transparent 
        rightComponent={
          <TouchableOpacity className="bg-black/40 p-2 rounded-full mr-4">
            <Ionicons name="bookmark-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        }
      />
      
      <ScrollView className="flex-1" bounces={false}>
        <Image
          source={{ uri: course.thumbnail || 'https://via.placeholder.com/600x400' }}
          className="w-full h-72"
          contentFit="cover"
        />
        
        <View className="px-5 pt-6 pb-28">
          <View className="flex-row items-center mb-3">
            <View className="bg-[#1E293B] px-3 py-1 rounded-full border border-[#334155]">
              <Text className="text-[#6366F1] font-medium text-xs uppercase tracking-wider">
                {course.category || 'Course'}
              </Text>
            </View>
            <View className="flex-row items-center ml-4">
              <Ionicons name="star" size={14} color="#FBBF24" />
              <Text className="text-gray-300 ml-1 text-sm">{course.rating?.toFixed(1) || '0.0'}</Text>
            </View>
          </View>

          <Text className="text-3xl font-bold text-white mb-2 leading-9">
            {course.title}
          </Text>
          
          <Text className="text-[#6366F1] text-2xl font-bold mb-6">
            ${course.price?.toFixed(2) || '0.00'}
          </Text>
          
          <Text className="text-xl font-bold text-white mb-3">About the Course</Text>
          <Text className="text-gray-400 text-base leading-7 mb-8">
            {course.description}
          </Text>
          
          <Text className="text-xl font-bold text-white mb-4">Instructor</Text>
          <View className="bg-[#1E293B] p-4 rounded-2xl flex-row items-center mb-4 border border-[#334155]">
            <Image
              source={{ uri: course.instructor?.picture?.large || 'https://via.placeholder.com/150' }}
              className="w-16 h-16 rounded-full bg-gray-600"
            />
            <View className="ml-4 flex-1">
              <Text className="text-white font-bold text-lg">
                {course.instructor?.name?.title ? `${course.instructor.name.title} ` : ''}
                {course.instructor?.name?.first} {course.instructor?.name?.last}
              </Text>
              <Text className="text-gray-400 text-sm mt-1">
                @{course.instructor?.email?.split('@')[0] || 'instructor'}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Sticky Action Bar */}
      <View className="absolute bottom-0 left-0 right-0 bg-[#1E293B] border-t border-[#334155]">
         <SafeAreaView edges={['bottom']}>
          <View className="px-5 py-4">
            {isEnrolled ? (
              <TouchableOpacity 
                className="bg-[#6366F1] py-4 rounded-xl flex-row items-center justify-center"
                onPress={handleViewContent}
              >
                <Ionicons name="play-circle" size={22} color="white" />
                <Text className="text-white font-bold text-lg ml-2">View Content</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                className="bg-[#6366F1] py-4 rounded-xl flex-row items-center justify-center opacity-90 active:opacity-100"
                onPress={handleEnroll}
                disabled={isEnrolling}
              >
                {isEnrolling ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <>
                    <Text className="text-white font-bold text-lg">Enroll Now</Text>
                  </>
                )}
              </TouchableOpacity>
            )}
          </View>
         </SafeAreaView>
      </View>
    </View>
  );
}
