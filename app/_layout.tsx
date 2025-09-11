import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useMemo } from 'react';
import { MD3LightTheme as PaperLightTheme, Provider as PaperProvider } from 'react-native-paper';
import 'react-native-reanimated';

export default function RootLayout() {
  const queryClient = useMemo(() => new QueryClient(), []);

  const paperTheme = {
    ...PaperLightTheme,
    colors: {
      ...PaperLightTheme.colors,
      primary: '#A78BFA', // soft light purple
      secondary: '#8B5CF6',
      // keep the rest from the light theme
    },
  } as const;

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={DefaultTheme}>
        <PaperProvider theme={paperTheme}>
          <Slot />
          <StatusBar style="auto" />
        </PaperProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
