import React from 'react';
import { View } from 'react-native';
import { Text, TextInput, TextInputProps } from 'react-native-paper';

interface FormInputProps extends TextInputProps {
  label: string;
  rightIcon?: React.ReactNode;
}

export function FormInput({ label, rightIcon, ...props }: FormInputProps) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text variant="labelLarge" style={{ marginBottom: 8 }}>
        {label}
      </Text>
      <TextInput mode="outlined" right={rightIcon} {...props} />
    </View>
  );
}
