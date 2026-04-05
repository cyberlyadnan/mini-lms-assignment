import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type HeaderProps = {
  title?: string;
  showBack?: boolean;
  transparent?: boolean;
  rightComponent?: React.ReactNode;
};

export function Header({ title, showBack = true, transparent = false, rightComponent }: HeaderProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View 
      style={{ paddingTop: transparent ? insets.top : 12 }} 
      className={`px-4 pb-4 flex-row items-center justify-between ${transparent ? 'absolute top-0 left-0 right-0 z-50 bg-transparent' : 'bg-[#0F172A] border-b border-[#1E293B]'}`}
    >
      <View className="flex-row items-center flex-1">
        {showBack && (
          <TouchableOpacity 
            onPress={() => router.canGoBack() ? router.back() : router.replace('/')} 
            className={`mr-4 p-2 -ml-2 rounded-full ${transparent ? 'bg-black/40' : ''}`}
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        )}
        {title && <Text className="text-white text-xl font-bold flex-1" numberOfLines={1}>{title}</Text>}
      </View>
      {rightComponent && <View>{rightComponent}</View>}
    </View>
  );
}
