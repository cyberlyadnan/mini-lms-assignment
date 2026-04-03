import { useEffect } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the tab-based home screen immediately
    router.replace('/(tabs)');
  }, [router]);

  return (
    <SafeAreaView className="flex-1 bg-[#0F172A] items-center justify-center">
      <Text className="text-white text-lg">Loading your courses...</Text>
      <View className="mt-4 rounded-full w-10 h-10 bg-[#6366F1] animate-pulse" />
    </SafeAreaView>
  );
}

