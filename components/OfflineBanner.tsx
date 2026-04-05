import React, { useEffect, useRef } from 'react';
import { Text, Animated } from 'react-native';
import { useNetwork } from '../hooks/useNetwork';

export const OfflineBanner = () => {
  const { isConnected } = useNetwork();
  const translateY = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    if (!isConnected) {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isConnected, translateY]);

  return (
    <Animated.View 
      className="bg-red-500 py-3 flex-row justify-center items-center shadow-md absolute top-0 left-0 right-0 z-50"
      style={{ transform: [{ translateY }] }}
    >
      <Text className="text-white font-bold text-sm text-center">
        No Internet Connection
      </Text>
    </Animated.View>
  );
};
