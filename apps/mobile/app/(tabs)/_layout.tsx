import { Ionicons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * Navegación inferior del área autenticada.
 *
 * El diseño de referencia: Inicio, Mascotas, acción central, Chat, Perfil.
 * La pestaña Mapa del prototipo queda fuera porque el proyecto excluye el mapa interactivo.
 */
export default function TabsLayout() {
  const router = useRouter();
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
      <Tabs.Screen
        name="accion"
        options={{
          title: '',
          tabBarLabel: () => null,
          tabBarButton: () => (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Crear mascota"
              onPress={() => router.push('/mascotas/crear')}
              className="-top-5 items-center justify-start"
            >
              <View
                className="h-14 w-14 items-center justify-center rounded-full shadow-md"
                style={{ backgroundColor: '#E8C04A' }}
              >
                <Ionicons name="paw" size={26} color="#FFFFFF" />
              </View>
            </Pressable>
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
