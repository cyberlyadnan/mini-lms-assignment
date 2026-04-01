import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ 
  value, 
  onChangeText, 
  placeholder = 'Search courses...' 
}) => {
  const [internalValue, setInternalValue] = useState(value);

  // Debounce the actual trigger correctly
  useEffect(() => {
    const handler = setTimeout(() => {
      onChangeText(internalValue);
    }, 300);

    return () => clearTimeout(handler);
  }, [internalValue, onChangeText]);

  // Sync external resets
  useEffect(() => {
    if (value !== internalValue) {
      setInternalValue(value);
    }
  }, [value]);

  return (
    <View className="flex-row items-center bg-[#1E293B] rounded-xl px-4 py-2 my-4 border border-[#334155] h-14">
      <Ionicons name="search" size={20} color="#64748B" />
      <TextInput
        className="flex-1 text-white ml-2 text-base px-2 h-full"
        placeholder={placeholder}
        placeholderTextColor="#64748B"
        value={internalValue}
        onChangeText={setInternalValue}
        autoCorrect={false}
      />
      {internalValue.length > 0 && (
        <TouchableOpacity 
          onPress={() => setInternalValue('')}
          className="p-1"
          hitSlop={10}
        >
          <Ionicons name="close-circle" size={20} color="#94A3B8" />
        </TouchableOpacity>
      )}
    </View>
  );
};
