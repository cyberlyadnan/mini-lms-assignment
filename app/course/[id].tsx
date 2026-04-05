import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Header } from '../../components/Header';
import { useCourseStore } from '../../store/courseStore';
import { CourseWithInstructor } from '../../types/course.types';
import { getItem, saveItem } from '../../utils/asyncStorage';
import { ENROLLED_COURSE_KEY } from '../../utils/constants';
import { enrolledIdsFromRaw } from '../../utils/enrolledCourses';

export default function CourseDetailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id, courseData } = useLocalSearchParams<{ id: string, courseData: string }>();
  const [course, setCourse] = useState<CourseWithInstructor | null>(null);
  
  const { bookmarks, toggleBookmark } = useCourseStore();
  const isBookmarked = bookmarks.some(b => course && b.id === course.id);

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
    <SafeAreaView className="flex-1 pb-8 bg-[#0F172A]" edges={['top']}>
      <Header 
        rightComponent={
          <TouchableOpacity 
            className="p-2 -mr-2 rounded-full" 
            onPress={() => course && toggleBookmark(course)}
          >
            <Ionicons name={isBookmarked ? "bookmark" : "bookmark-outline"} size={24} color={isBookmarked ? "#6366F1" : "#FFFFFF"} />
          </TouchableOpacity>
        }
      />
      
      <ScrollView className="flex-1" bounces={false}>
        <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} className="h-[300px] w-full">
          {course.images && course.images.length > 0 ? (
            course.images.map((img, idx) => (
              <Image
                key={idx}
                source={{ uri: img }}
                style={{ width: Dimensions.get('window').width, height: 300 }}
                resizeMode="cover"
              />
            ))
          ) : (
            <Image
              source={{ uri: course.thumbnail || 'https://via.placeholder.com/600x400' }}
              style={{ width: Dimensions.get('window').width, height: 300 }}
              resizeMode="cover"
            />
          )}
        </ScrollView>
        
        <View className="px-5 pt-6 pb-28">
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center">
              <View className="bg-[#1E293B] px-3 py-1 rounded-full border border-[#334155]">
                <Text className="text-[#6366F1] font-medium text-xs uppercase tracking-wider">
                  {course.category || 'Course'}
                </Text>
              </View>
              <View className="flex-row items-center ml-4 bg-[#1E293B] px-2 py-1 rounded-md">
                <Ionicons name="star" size={14} color="#FBBF24" />
                <Text className="text-gray-300 ml-1 text-xs font-bold">{course.rating?.toFixed(1) || '0.0'}</Text>
              </View>
            </View>
            {course.discountPercentage > 0 && (
              <View className="bg-emerald-500/20 px-3 py-1 rounded-full">
                <Text className="text-emerald-400 font-bold text-xs">{course.discountPercentage}% OFF</Text>
              </View>
            )}
          </View>

          <Text className="text-3xl font-bold text-white mb-1 leading-9">
            {course.title}
          </Text>
          <Text className="text-gray-400 text-sm mb-4">By {course.brand || 'Learnify Originals'}</Text>
          
          <View className="flex-row items-end mb-6">
            <Text className="text-[#6366F1] text-3xl font-bold">
              ${course.price?.toFixed(2) || '0.00'}
            </Text>
            {course.discountPercentage > 0 && (
              <Text className="text-gray-500 text-lg line-through ml-3 mb-1">
                ${(course.price * (1 + course.discountPercentage / 100)).toFixed(2)}
              </Text>
            )}
            {course.stock > 0 && (
              <Text className="text-gray-400 text-xs ml-auto mb-2 tracking-wide font-medium">ONLY {course.stock} SEATS LEFT</Text>
            )}
          </View>
          
          <Text className="text-xl font-bold text-white mb-3">About the Course</Text>
          <View className="bg-[#1E293B] p-4 rounded-xl mb-8 border border-[#334155]">
            <Text className="text-gray-400 text-base leading-7">
              {course.description}
            </Text>
          </View>
          
          <Text className="text-xl font-bold text-white mb-4">Instructor Profile</Text>
          <View className="bg-[#1E293B] p-5 rounded-2xl mb-4 border border-[#334155]">
            <View className="flex-row items-center">
              <Image
                // source={{ uri:  course.instructor?.picture?.large || 'https://via.placeholder.com/150' }}
                source={{ uri:  course.instructor?.picture?.large || 'https://via.placeholder.com/150' }}
                style={{ width: 64, height: 64, borderRadius: 32, borderWidth: 2, borderColor: '#6366F1' }}
                resizeMode="cover"
              />
              <View className="ml-4 flex-1">
                <Text className="text-white font-bold text-xl">
                  {course.instructor?.name?.title ? `${course.instructor.name.title} ` : ''}
                  {course.instructor?.name?.first} {course.instructor?.name?.last}
                </Text>
                {course.instructor?.location?.city && (
                  <View className="flex-row items-center mt-1.5">
                    <Ionicons name="location" size={14} color="#94A3B8" />
                    <Text className="text-gray-400 text-sm ml-1" numberOfLines={1}>
                      {course.instructor.location.city}, {course.instructor.location.country}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            <View className="bg-[#0F172A] p-4 rounded-xl mt-5 flex-row flex-wrap">
               {typeof course.instructor?.registered?.age === 'number' && (
                 <View className="w-1/2 mb-4">
                   <Text className="text-gray-500 text-[11px] uppercase tracking-wider mb-1">Experience</Text>
                   <Text className="text-white font-semibold">{course.instructor.registered.age} Years</Text>
                 </View>
               )}
               {typeof course.instructor?.dob?.age === 'number' && (
                 <View className="w-1/2 mb-4">
                   <Text className="text-gray-500 text-[11px] uppercase tracking-wider mb-1">Age</Text>
                   <Text className="text-white font-semibold">{course.instructor.dob.age} Years</Text>
                 </View>
               )}
               {course.instructor?.email && (
                 <View className="w-full mb-3 bg-[#1E293B] px-3 py-2 rounded-lg flex-row items-center">
                   <Ionicons name="mail" size={16} color="#6366F1" />
                   <View className="ml-3">
                     <Text className="text-gray-500 text-[10px] uppercase tracking-wider mb-0.5">Email</Text>
                     <Text className="text-gray-300 font-medium text-sm">{course.instructor.email}</Text>
                   </View>
                 </View>
               )}
               {course.instructor?.phone && (
                 <View className="w-full bg-[#1E293B] px-3 py-2 rounded-lg flex-row items-center">
                   <Ionicons name="call" size={16} color="#6366F1" />
                   <View className="ml-3">
                     <Text className="text-gray-500 text-[10px] uppercase tracking-wider mb-0.5">Contact</Text>
                     <Text className="text-gray-300 font-medium text-sm">{course.instructor.phone}</Text>
                   </View>
                 </View>
               )}
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
    </SafeAreaView>
  );
}
