import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

import { useSesion } from '@/hooks/useSesion';

export default function Index() {
  const { usuario, cargando } = useSesion();

  // Mientras se lee la sesión guardada, para no mostrar el login a alguien ya logueado.
  if (cargando) {
    return (
      <View className="flex-1 items-center justify-center bg-pethood-beige">
        <ActivityIndicator size="large" color="#FF9D5C" />
      </View>
    );
  }

  return <Redirect href={usuario ? '/(tabs)' : '/login'} />;
}
