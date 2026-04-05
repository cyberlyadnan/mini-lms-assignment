import React, { ErrorInfo, ReactNode } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(_: Error, __: ErrorInfo): void {
    // Intentionally silent in production UI
  }

  private handleRetry = (): void => {
    this.setState({ hasError: false });
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      return (
        <View className="flex-1 bg-[#0F172A] items-center justify-center px-6">
          <View className="w-16 h-16 rounded-full bg-red-500/20 items-center justify-center mb-4">
            <Ionicons name="alert-circle-outline" size={34} color="#F87171" />
          </View>
          <Text className="text-white text-2xl font-bold mb-2 text-center">Something went wrong</Text>
          <Text className="text-gray-400 text-center mb-6">
            We hit an unexpected problem. Please try again.
          </Text>
          <TouchableOpacity
            onPress={this.handleRetry}
            className="bg-[#6366F1] px-6 py-3 rounded-xl"
            activeOpacity={0.85}
          >
            <Text className="text-white font-semibold">Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

