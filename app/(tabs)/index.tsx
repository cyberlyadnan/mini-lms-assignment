import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CourseCard } from '../../components/CourseCard';
import { OfflineBanner } from '../../components/OfflineBanner';
import { SearchBar } from '../../components/SearchBar';
import { useCourses } from '../../hooks/useCourses';
import { useCourseStore } from '../../store/courseStore';
import { CourseWithInstructor } from '../../types/course.types';

// Simple Skeleton placeholder mimicking CourseCard layout
const CourseSkeleton = () => (
  <View className="bg-[#1E293B] rounded-2xl mb-4 overflow-hidden border border-[#334155] h-[320px]">
     <View className="h-44 w-full bg-[#334155] animate-pulse" />
     <View className="p-4">
        <View className="h-6 bg-[#334155] w-3/4 mb-3 rounded animate-pulse" />
        <View className="h-4 bg-[#334155] w-full mb-1 rounded animate-pulse" />
        <View className="h-4 bg-[#334155] w-1/2 mb-4 rounded animate-pulse" />
        <View className="flex-row items-center">
            <View className="w-8 h-8 rounded-full bg-[#334155] animate-pulse" />
            <View className="ml-3 flex-1">
                <View className="h-4 bg-[#334155] w-1/3 mb-1 rounded animate-pulse" />
                <View className="h-3 bg-[#334155] w-1/4 rounded animate-pulse" />
            </View>
        </View>
     </View>
  </View>
);

export default function CourseListScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const { courses: fetchedCourses, isLoading, isError, refetch, isFetching } = useCourses(1, 20);
  const { bookmarks, toggleBookmark, loadBookmarks } = useCourseStore();

  useEffect(() => {
    loadBookmarks();
  }, [loadBookmarks]);

  useEffect(() => {
    if (fetchedCourses && fetchedCourses.length > 0) {
      console.log('Course list data from API:', fetchedCourses);
    }
  }, [fetchedCourses]);

  const filteredCourses = useMemo(() => {
    if (!search.trim()) return fetchedCourses;
    const lowerQuery = search.toLowerCase();
    return fetchedCourses.filter((course) => 
      (course.title || '').toLowerCase().includes(lowerQuery) || 
      (course.description || '').toLowerCase().includes(lowerQuery) ||
      (course.instructor?.name?.first || '').toLowerCase().includes(lowerQuery) ||
      (course.instructor?.name?.last || '').toLowerCase().includes(lowerQuery)
    );
  }, [fetchedCourses, search]);

  const handlePressCourse = useCallback((course: CourseWithInstructor) => {
    router.push({
      pathname: '/course/[id]',
      params: { 
        id: course.id.toString(),
        courseData: JSON.stringify(course) 
      }
    });
  }, [router]);

  const handleBookmarkToggle = useCallback((course: CourseWithInstructor) => {
    toggleBookmark(course);
  }, [toggleBookmark]);

  const renderItem = useCallback(({ item }: { item: CourseWithInstructor }) => {
    const isBookmarked = bookmarks.some(b => b.id === item.id);
    return (
      <CourseCard 
        course={item} 
        isBookmarked={isBookmarked}
        onPress={handlePressCourse} 
        onBookmark={handleBookmarkToggle} 
      />
    );
  }, [bookmarks, handlePressCourse, handleBookmarkToggle]);

  return (
    <SafeAreaView className="flex-1 bg-[#0F172A]" edges={['top']}>
      <OfflineBanner />
      
      {/* Header Area */}
      <View className="px-4 pt-4 pb-2 z-10">
        <Text className="text-3xl font-bold text-white mb-1">Discover</Text>
        <Text className="text-gray-400 text-sm">Find the best courses for you</Text>
        
        <SearchBar 
          value={search} 
          onChangeText={setSearch} 
          placeholder="Search courses, topic or instructor" 
        />
      </View>

      {/* Main Content Area */}
      {isLoading && !fetchedCourses.length ? (
        <View className="px-4 flex-1 mt-2">
          <CourseSkeleton />
          <CourseSkeleton />
          <CourseSkeleton />
        </View>
      ) : isError ? (
        <View className="flex-1 justify-center items-center px-6">
          <Text className="text-red-400 text-lg font-bold mb-2 text-center">Oops! Something went wrong.</Text>
          <Text className="text-gray-400 text-center mb-6">We couldn&apos;t load the courses. Please check your connection and try again.</Text>
          <TouchableOpacity 
             className="bg-[#6366F1] px-6 py-4 rounded-xl shadow-lg"
             onPress={() => refetch()}
          >
             <Text className="text-white font-bold text-base">Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredCourses}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24, paddingTop: 8 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="py-20 items-center justify-center">
              <Text className="text-gray-400 text-lg text-center leading-7">No courses found matching{'\n'}&quot;{search}&quot;</Text>
            </View>
          }
          refreshControl={
            <RefreshControl
              refreshing={isFetching && !isLoading}
              onRefresh={refetch}
              tintColor="#6366F1"
              colors={['#6366F1']}
            />
          }
        />
      )}
    </SafeAreaView>
  );
}
