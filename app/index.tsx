import { Redirect } from 'expo-router';

export default function RootIndex() {
  // Always redirect to login by default
  return <Redirect href="/auth/login" />;
}


