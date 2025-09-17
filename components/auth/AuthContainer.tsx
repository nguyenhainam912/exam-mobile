import React from 'react';
import {
  ImageBackground,
  ImageSourcePropType,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from 'react-native';

interface AuthContainerProps {
  children: React.ReactNode;
  backgroundImage: ImageSourcePropType;
}

export function AuthContainer({
  children,
  backgroundImage,
}: AuthContainerProps) {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: '#F5F3FF' }}
    >
      <ImageBackground
        source={backgroundImage}
        style={{ flex: 1, width: '100%', height: '100%' }}
        resizeMode="cover"
        imageStyle={{ opacity: 0.25 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={{ flex: 1, justifyContent: 'flex-end' }}>
            {children}
          </View>
        </ScrollView>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}
