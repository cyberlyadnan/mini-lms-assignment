import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import * as RN from 'react-native';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Search courses...',
}) => {
  const [internalValue, setInternalValue] = useState(value);
  const isAndroid = RN.Platform.OS === 'android';

  useEffect(() => {
    const handler = setTimeout(() => {
      onChangeText(internalValue);
    }, 300);

    return () => clearTimeout(handler);
  }, [internalValue, onChangeText]);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  return (
    <RN.View
      className={`flex-row items-center bg-[#1E293B] rounded-xl px-4 py-2 ${isAndroid ? 'pt-3' : 'pb-3'} my-4 border border-[#334155] h-14`}
    >
      <Ionicons name="search" size={20} color="#64748B" />
      <RN.TextInput
        className="flex-1 text-white ml-2 text-base px-2 h-full"
        placeholder={placeholder}
        placeholderTextColor="#64748B"
        value={internalValue}
        onChangeText={setInternalValue}
        autoCorrect={false}
        {...(isAndroid
          ? {
              textAlignVertical: 'center' as const,
              includeFontPadding: false,
              paddingVertical: 0,
            }
          : {})}
      />
      {internalValue.length > 0 && (
        <RN.TouchableOpacity
          onPress={() => setInternalValue('')}
          className="p-1"
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Clear search"
        >
          <Ionicons name="close-circle" size={20} color="#94A3B8" />
        </RN.TouchableOpacity>
      )}
    </RN.View>
  );
};
