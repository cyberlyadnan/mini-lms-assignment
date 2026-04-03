import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useRouter } from 'expo-router';
import { useAuthStore } from '../../store/authStore';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    Keyboard.dismiss();
    setSubmitting(true);
    try {
      await login({ email: data.email, password: data.password });
      // The router replace is usually caught by the layout, but explicitly navigating minimizes flicker
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'Please check your credentials');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 bg-[#0F172A] justify-center px-6"
      >
        <View className="mb-10">
          <Text className="text-4xl font-bold text-white mb-2">Welcome Back</Text>
          <Text className="text-gray-400 text-base">Sign in to continue your learning journey.</Text>
        </View>

        <View className="space-y-4 mb-6">
          <View>
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

          <View>
            <Text className="text-gray-300 mb-2 font-medium mt-4">Password</Text>
            <View className={`flex-row items-center bg-[#1E293B] rounded-xl border ${errors.password ? 'border-red-500' : 'border-[#334155]'}`}>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className="flex-1 text-white px-4 py-4"
                    placeholder="Enter your password"
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
        </View>

        <TouchableOpacity 
          className={`bg-[#6366F1] py-4 rounded-xl items-center justify-center mb-6 mt-4 ${submitting || isLoading ? 'opacity-70' : 'opacity-90'} active:opacity-100`}
          onPress={handleSubmit(onSubmit)}
          disabled={submitting || isLoading}
        >
          {submitting || isLoading ? (
            <View className="flex-row items-center">
              <ActivityIndicator color="#ffffff" />
              <Text className="text-white font-bold text-lg ml-3">Signing in…</Text>
            </View>
          ) : (
            <Text className="text-white font-bold text-lg">Sign In</Text>
          )}
        </TouchableOpacity>

        <View className="flex-row justify-center mt-4">
          <Text className="text-gray-400">Don't have an account? </Text>
          <Link href="/(auth)/register" asChild>
            <TouchableOpacity>
              <Text className="text-[#6366F1] font-bold">Sign Up</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
