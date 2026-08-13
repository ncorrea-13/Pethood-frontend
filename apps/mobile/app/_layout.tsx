import '../global.css';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { ToastProvider } from '@/components/feedback/Toast';
import { SesionProvider } from '@/hooks/useSesion';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function RootLayout() {
  return (
    <SesionProvider>
      {/* El provider de toasts envuelve al Stack para que un toast disparado antes de
          navegar siga visible en la pantalla siguiente. */}
      <ToastProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="mascotas/crear" options={{ presentation: 'card' }} />
        </Stack>
      </ToastProvider>
    </SesionProvider>
  );
}
