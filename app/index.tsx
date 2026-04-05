
import { ActivityIndicator, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../hooks/useAuth';

export default function Index() {
  const { isInitialized, isLoading } = useAuth();
  const isStartingUp = !isInitialized || isLoading;

  return (
    <SafeAreaView className="flex-1 bg-[#0F172A] items-center justify-center">
      <ActivityIndicator size="large" color="#6366F1" />
      <Text className="text-gray-400 text-sm mt-4 tracking-wide font-medium">
        {isStartingUp ? 'Starting up…' : 'Loading…'}
      </Text>
    </SafeAreaView>
  );
}