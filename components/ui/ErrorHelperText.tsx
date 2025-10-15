import React from 'react';
import { HelperText } from 'react-native-paper';

interface ErrorHelperTextProps {
  error?: string;
  visible?: boolean;
  style?: any;
}

const ErrorHelperText: React.FC<ErrorHelperTextProps> = ({
  error,
  visible = !!error,
  style,
}) => {
  return (
    <HelperText type="error" visible={visible} style={style}>
      {error}
    </HelperText>
  );
};

export default ErrorHelperText;
