import React, { memo } from 'react';
import { View, Text, TouchableOpacity, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { CourseWithInstructor } from '../types/course.types';

interface CourseCardProps {
  course: CourseWithInstructor;
  isBookmarked: boolean;
  onPress: (course: CourseWithInstructor) => void;
  onBookmark: (course: CourseWithInstructor) => void;
}

const CourseCardComponent: React.FC<CourseCardProps> = ({ 
  course, 
  isBookmarked,
  onPress, 
  onBookmark 
}) => {
  return (
    <TouchableOpacity
      className="bg-[#1E293B] rounded-2xl mb-4 overflow-hidden border border-[#334155]"
      onPress={() => onPress(course)}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={`View course details for ${course.title}`}
    >
      <View className="h-44 w-full relative">
        <Image
          source={{ uri: course.thumbnail || 'https://via.placeholder.com/400x200' }}
          className="flex-1 w-full h-full"
          style={{ width: '100%', height: '100%' }}
          contentFit="cover"
          cachePolicy="memory-disk"
          transition={200}
        />
        
        {/* Bookmark Overlay Top Right */}
        <View className="absolute top-3 right-3 bg-black/40 rounded-full">
          <Pressable 
            onPress={() => onBookmark(course)}
            className="p-2"
            hitSlop={15}
            accessibilityRole="button"
            accessibilityLabel={isBookmarked ? "Remove bookmark" : "Add bookmark"}
          >
            <Ionicons 
              name={isBookmarked ? 'bookmark' : 'bookmark-outline'} 
              size={22} 
              color={isBookmarked ? '#6366F1' : '#FFFFFF'} 
            />
          </Pressable>
        </View>

        {/* Price Overlay Bottom Left */}
        <View className="absolute bottom-3 left-3 bg-[#0F172A]/80 px-2 py-1 rounded-md">
          <Text className="text-[#6366F1] font-bold text-sm">
            ${course.price?.toFixed(2) || '0.00'}
          </Text>
        </View>
      </View>
      
      <View className="p-4">
        <Text 
          className="text-white font-bold text-lg mb-1" 
          numberOfLines={1}
        >
          {course.title || 'Untitled Course'}
        </Text>
        <Text 
          className="text-gray-400 text-sm mb-4 leading-5" 
          numberOfLines={2}
        >
          {course.description || 'No description available.'}
        </Text>
        
        <View className="flex-row items-center">
          <Image
            source={{ uri: course.instructor?.picture?.thumbnail || 'https://via.placeholder.com/150' }}
            className="w-8 h-8 rounded-full bg-gray-600"
            style={{ width: 32, height: 32, borderRadius: 16 }}
            contentFit="cover"
          />
          <View className="ml-3 flex-1">
            <Text className="text-gray-300 text-sm font-medium" numberOfLines={1}>
              {course.instructor?.name?.title ? `${course.instructor.name.title} ` : ''}
              {course.instructor?.name?.first || 'Unknown'} {course.instructor?.name?.last || 'Instructor'}
            </Text>
            <View className="flex-row items-center mt-0.5">
              <Ionicons name="star" size={12} color="#FBBF24" />
              <Text className="text-gray-400 text-xs ml-1">
                {course.rating?.toFixed(1) || '0.0'} ({course.stock || 0} enrolled)
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export const CourseCard = memo(CourseCardComponent, (prevProps, nextProps) => {
  return (
    prevProps.course.id === nextProps.course.id &&
    prevProps.isBookmarked === nextProps.isBookmarked
  );
});
