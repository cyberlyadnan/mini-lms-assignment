import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { z } from 'zod';
import { handleApiError } from '../../services/api';
import { useAuthStore } from '../../store/authStore';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const { login } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: { email: '', password: '' },
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    Keyboard.dismiss();
    if (submitting) return;

    setSubmitting(true);
    try {
      await login({
        email: data.email,
        password: data.password,
      });
      router.replace('/(tabs)/home');
    } catch (error: any) {
      const apiError = handleApiError(error);
      Alert.alert('Login Failed', apiError.message || 'Please check your credentials');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 bg-[#0F172A]"
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          paddingHorizontal: 24,
          paddingVertical: 40,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="mb-10">
          <Text className="text-4xl font-bold text-white mb-2">Welcome Back</Text>
          <Text className="text-gray-400 text-base">
            Sign in to continue your learning journey.
          </Text>
        </View>

        <View className="space-y-4 mb-6">
          {/* EMAIL */}
          <View>
            <Text className="text-gray-300 mb-2 font-medium">Email Address</Text>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className={`bg-[#1E293B] text-white px-4 py-4 rounded-xl border ${
                    errors.email ? 'border-red-500' : 'border-[#334155]'
                  }`}
                  placeholder="name@example.com"
                  placeholderTextColor="#64748B"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value ?? ''}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              )}
            />
            {errors.email && (
              <Text className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </Text>
            )}
          </View>

          {/* PASSWORD */}
          <View>
            <Text className="text-gray-300 mb-2 font-medium mt-4">Password</Text>
            <View
              className={`flex-row items-center bg-[#1E293B] rounded-xl border ${
                errors.password ? 'border-red-500' : 'border-[#334155]'
              }`}
            >
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
                    value={value ?? ''}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                  />
                )}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                className="px-4 py-4"
              >
                <Text className="text-[#6366F1] font-medium">
                  {showPassword ? 'Hide' : 'Show'}
                </Text>
              </TouchableOpacity>
            </View>
            {errors.password && (
              <Text className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </Text>
            )}
          </View>
        </View>

        {/* LOGIN BUTTON */}
        <TouchableOpacity
          className={`bg-[#6366F1] py-4 rounded-xl items-center justify-center mb-6 mt-4 ${
            submitting ? 'opacity-70' : 'opacity-90'
          }`}
          onPress={handleSubmit(onSubmit)}
          disabled={submitting}
        >
          {submitting ? (
            <View className="flex-row items-center">
              <ActivityIndicator color="#ffffff" />
              <Text className="text-white font-bold text-lg ml-3">
                Signing in…
              </Text>
            </View>
          ) : (
            <Text className="text-white font-bold text-lg">Sign In</Text>
          )}
        </TouchableOpacity>

        {/* SIGN UP */}
        <View className="flex-row justify-center mt-4 mb-6">
          <Text className="text-gray-400">Don&apos;t have an account? </Text>
          <Link href="/(auth)/register" asChild>
            <TouchableOpacity>
              <Text className="text-[#6366F1] font-bold">Sign Up</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}