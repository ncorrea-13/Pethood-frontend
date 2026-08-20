import '../global.css';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import 'react-native-reanimated';

import { ToastProvider } from '@/components/feedback/Toast';
import { SesionProvider, useSesion } from '@/hooks/useSesion';

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
        <RootNavigator />
      </ToastProvider>
    </SesionProvider>
  );
}

function RootNavigator() {
  const { autenticado, cargando } = useSesion();

  if (cargando) {
    return <View className="flex-1 bg-pethood-beige" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />

      <Stack.Protected guard={!autenticado}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>

      <Stack.Protected guard={autenticado}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="home" />
        {/* GUI-12. Va en el stack y no en las tabs porque se entra desde la Home y desde
            el Perfil, y el back tiene que volver al origen real. */}
        <Stack.Screen name="favoritos" />
        <Stack.Screen name="mascotas/crear" options={{ presentation: 'card' }} />
        <Stack.Screen name="mascotas/[id]/editar" options={{ presentation: 'card' }} />
        <Stack.Screen name="publicaciones/crear" options={{ presentation: 'card' }} />
        <Stack.Screen name="perfil/editar" options={{ presentation: 'card' }} />
        <Stack.Screen name="perfil/password" options={{ presentation: 'card' }} />
        <Stack.Screen name="+not-found" />
      </Stack.Protected>
    </Stack>
  );
}
