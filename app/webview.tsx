import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { COURSE_HTML_TEMPLATE } from '../utils/constants';
import { Header } from '../components/Header';

export default function WebviewScreen() {
  const router = useRouter();
  const { title, description, instructorName } = useLocalSearchParams<{ 
    title: string; 
    description: string; 
    instructorName: string; 
  }>();
  
  const webViewRef = useRef<WebView>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const injectedPayload = JSON.stringify({
    type: 'COURSE_DATA',
    title: title || 'Course',
    description: description || '',
    instructorName: instructorName || ''
  });

  const injectedJavaScript = `
    setTimeout(function() {
       document.dispatchEvent(new MessageEvent('message', {
         data: ${injectedPayload}
       }));
    }, 100);
    true;
  `;

  const onMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'BACK') {
        if (router.canGoBack()) {
          router.back();
        } else {
          router.replace('/(tabs)');
        }
      }
    } catch {
      // ignore malformed webview messages
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0F172A]" edges={['top', 'bottom']}>
      <Header title="Course Content" />

      {isLoading && !hasError && (
        <View className="absolute top-0 left-0 right-0 z-10 w-full">
          <ActivityIndicator 
            size="small" 
            color="#6366F1" 
            className="py-2 bg-[#1E293B]" 
          />
        </View>
      )}

      {hasError ? (
        <View className="flex-1 justify-center items-center px-6">
          <Text className="text-red-400 text-lg font-bold mb-2">Failed to load content</Text>
          <Text className="text-gray-400 text-center">There was an error establishing a secure connection to the platform.</Text>
        </View>
      ) : (
        <WebView
          ref={webViewRef}
          className="flex-1 bg-[#0F172A]"
          source={{ html: COURSE_HTML_TEMPLATE }}
          injectedJavaScript={injectedJavaScript}
          onMessage={onMessage}
          onLoadStart={() => setIsLoading(true)}
          onLoadEnd={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
          javaScriptEnabled={true}
          bounces={false}
          showsVerticalScrollIndicator={false}
          containerStyle={{ backgroundColor: '#0F172A' }}
        />
      )}
    </SafeAreaView>
  );
}
