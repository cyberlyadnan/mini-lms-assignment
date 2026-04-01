import React from 'react';
import { ActivityIndicator, View } from 'react-native';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  color?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'large', 
  color = '#6366F1',
  className = ''
}) => {
  return (
    <View className={`flex-1 justify-center items-center ${className}`}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};
