import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Alert, Keyboard } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useRouter } from 'expo-router';
import { useAuthStore } from '../../store/authStore';
import { handleApiError } from '../../services/api';

const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  username: z.string().min(3, 'Username must be at least 3 characters').regex(/^[a-zA-Z0-9]+$/, 'Alphanumeric only'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters').regex(/^(?=.*[A-Z])(?=.*\d).+$/, 'Must contain at least 1 uppercase letter and 1 number'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterScreen() {
  const router = useRouter();
  const { register, login, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    Keyboard.dismiss();
    try {
      await register({ 
        username: data.username, 
        fullName: data.fullName, 
        email: data.email, 
        password: data.password 
      });
      await login({ email: data.email, password: data.password });
      router.replace('/(tabs)');
    } catch (error: unknown) {
      const apiError = handleApiError(error);
      Alert.alert('Registration Failed', apiError.message || 'An error occurred during registration');
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 bg-[#0F172A]"
    >
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="mb-8">
          <Text className="text-4xl font-bold text-white mb-2">Create Account</Text>
          <Text className="text-gray-400 text-base">Join us and start your journey today.</Text>
        </View>

        <View className="space-y-4 mb-6">
          <View className="mb-4">
            <Text className="text-gray-300 mb-2 font-medium">Full Name</Text>
            <Controller
              control={control}
              name="fullName"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className={`bg-[#1E293B] text-white px-4 py-4 rounded-xl border ${errors.fullName ? 'border-red-500' : 'border-[#334155]'}`}
                  placeholder="John Doe"
                  placeholderTextColor="#64748B"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {errors.fullName && <Text className="text-red-500 text-sm mt-1">{errors.fullName.message}</Text>}
          </View>

          <View className="mb-4">
            <Text className="text-gray-300 mb-2 font-medium">Username</Text>
            <Controller
              control={control}
              name="username"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className={`bg-[#1E293B] text-white px-4 py-4 rounded-xl border ${errors.username ? 'border-red-500' : 'border-[#334155]'}`}
                  placeholder="johndoe123"
                  placeholderTextColor="#64748B"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  autoCapitalize="none"
                />
              )}
            />
            {errors.username && <Text className="text-red-500 text-sm mt-1">{errors.username.message}</Text>}
          </View>

          <View className="mb-4">
            <Text className="text-gray-300 mb-2 font-medium">Email Address</Text>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className={`bg-[#1E293B] text-white px-4 py-4 rounded-xl border ${errors.email ? 'border-red-500' : 'border-[#334155]'}`}
                  placeholder="name@example.com"
                  placeholderTextColor="#64748B"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              )}
            />
            {errors.email && <Text className="text-red-500 text-sm mt-1">{errors.email.message}</Text>}
          </View>

          <View className="mb-4">
            <Text className="text-gray-300 mb-2 font-medium">Password</Text>
            <View className={`flex-row items-center bg-[#1E293B] rounded-xl border ${errors.password ? 'border-red-500' : 'border-[#334155]'}`}>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className="flex-1 text-white px-4 py-4"
                    placeholder="Create a strong password"
                    placeholderTextColor="#64748B"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                  />
                )}
              />
              <TouchableOpacity 
                onPress={() => setShowPassword(!showPassword)}
                className="px-4 py-4"
              >
                <Text className="text-[#6366F1] font-medium">{showPassword ? 'Hide' : 'Show'}</Text>
              </TouchableOpacity>
            </View>
            {errors.password && <Text className="text-red-500 text-sm mt-1">{errors.password.message}</Text>}
          </View>

          <View className="mb-4">
            <Text className="text-gray-300 mb-2 font-medium">Confirm Password</Text>
            <View className={`flex-row items-center bg-[#1E293B] rounded-xl border ${errors.confirmPassword ? 'border-red-500' : 'border-[#334155]'}`}>
              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className="flex-1 text-white px-4 py-4"
                    placeholder="Repeat your password"
                    placeholderTextColor="#64748B"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                  />
                )}
              />
            </View>
            {errors.confirmPassword && <Text className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</Text>}
          </View>
        </View>

        <TouchableOpacity 
          className="bg-[#6366F1] py-4 rounded-xl items-center justify-center mb-6 mt-4 opacity-90 active:opacity-100"
          onPress={handleSubmit(onSubmit)}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text className="text-white font-bold text-lg">Create Account</Text>
          )}
        </TouchableOpacity>

        <View className="flex-row justify-center mt-2 mb-6">
          <Text className="text-gray-400">Already have an account? </Text>
          <Link href="/(auth)/login" asChild>
            <TouchableOpacity>
              <Text className="text-[#6366F1] font-bold">Sign In</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
