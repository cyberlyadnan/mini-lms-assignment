import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  Easing 
} from 'react-native-reanimated';
import { useNetwork } from '../hooks/useNetwork';

export const OfflineBanner = () => {
  const { isConnected } = useNetwork();
  const translateY = useSharedValue(-100);

  useEffect(() => {
    if (!isConnected) {
      translateY.value = withTiming(0, {
        duration: 300,
        easing: Easing.out(Easing.ease),
      });
    } else {
      translateY.value = withTiming(-100, {
        duration: 300,
      });
    }
  }, [isConnected]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
  }));

  // Hide entirely from layout once it's up
  if (isConnected && translateY.value === -100) return null;

  return (
    <Animated.View style={animatedStyle} className="bg-red-500 py-3 flex-row justify-center items-center shadow-md">
      <Text className="text-white font-bold text-sm text-center">
        No Internet Connection
      </Text>
    </Animated.View>
  );
};
