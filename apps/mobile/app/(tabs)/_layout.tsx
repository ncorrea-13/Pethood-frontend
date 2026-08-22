import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BotonTabCentral } from '@/components/ui/BotonTabCentral';

/**
 * Navegación inferior del área autenticada.
 *
 * El diseño de referencia: Inicio, Mascotas, Adoptar, Chat, Perfil.
 * La pestaña Mapa del prototipo queda fuera porque el proyecto excluye el mapa interactivo.
 */
export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const paddingBottom = Math.max(insets.bottom, 12);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#FF9D5C',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#F3F4F6',
          height: 64 + paddingBottom,
          paddingTop: 8,
          paddingBottom,
          overflow: 'visible',
        },
        tabBarItemStyle: { paddingTop: 2 },
        tabBarLabelStyle: { fontSize: 12, fontWeight: '500', paddingTop: 2, paddingBottom: 0 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="mis-mascotas"
        options={{
          title: 'Mascotas',
          tabBarIcon: ({ color, size }) => <Ionicons name="paw-outline" size={size} color={color} />,
        }}
      />
      {/* Es una tab real y no un atajo a otra ruta: la barra inferior queda presente sobre
          el mazo de tarjetas, con este botón resaltado. */}
      <Tabs.Screen
        name="adoptar"
        options={{
          title: '',
          tabBarLabel: () => null,
          tabBarButton: ({ onPress, accessibilityState }) => (
            <BotonTabCentral
              icono="paw"
              etiqueta="Adoptar"
              activo={Boolean(accessibilityState?.selected)}
              onPress={onPress}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubble-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
