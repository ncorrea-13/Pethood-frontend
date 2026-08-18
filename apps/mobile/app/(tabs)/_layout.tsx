import { Ionicons } from '@expo/vector-icons';
import { Redirect, Tabs } from 'expo-router';

import { useSesion } from '@/hooks/useSesion';

/**
 * Navegación inferior del área autenticada.
 *
 * Reducida a lo mínimo mientras el resto de las pantallas no existan. El diseño de
 * referencia tiene cinco pestañas (Inicio, Mapa, Favoritos, Chat, Perfil); la de Mapa
 * queda fuera porque el proyecto excluye el mapa interactivo, y las de Favoritos y Chat
 * se agregan cuando estén sus historias.
 */
export default function TabsLayout() {
  const { usuario, cargando } = useSesion();

  if (cargando) return null;
  if (!usuario) return <Redirect href="/login" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#FF9D5C',
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: { borderTopColor: '#E5E7EB' },
        tabBarLabelStyle: { fontSize: 12 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Mis mascotas',
          tabBarIcon: ({ color, size }) => <Ionicons name="paw" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
