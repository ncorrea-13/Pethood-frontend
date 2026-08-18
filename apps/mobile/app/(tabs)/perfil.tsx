/**
 * Perfil mínimo, solo para poder cerrar sesión y cambiar entre la cuenta de adoptante y
 * la de refugio mientras se prueba. La pantalla real es GUI-09, de otra historia.
 */
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useSesion } from '@/hooks/useSesion';

export default function PerfilScreen() {
  const router = useRouter();
  const { usuario, esRefugio, cerrarSesion } = useSesion();

  const salir = async (): Promise<void> => {
    await cerrarSesion();
    router.replace('/login');
  };

  return (
    <View className="flex-1 bg-pethood-beige">
      <SafeAreaView className="flex-1" edges={['top']}>
        <View className="border-b border-gray-200 bg-white px-5 py-4">
          <Text className="text-xl font-bold text-gray-900">Perfil</Text>
        </View>

        <View className="px-5 py-6">
          <View className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <Text className="text-lg font-bold text-gray-900">
              {usuario?.nombre} {usuario?.apellido}
            </Text>
            <Text className="mt-1 text-sm text-gray-600">{usuario?.email}</Text>

            <View className="mt-3 flex-row items-center gap-2">
              <View className="rounded-full border border-orange-100 bg-orange-50 px-3 py-1">
                <Text className="text-xs text-orange-700">{esRefugio ? 'Refugio' : 'Adoptante'}</Text>
              </View>

              {usuario?.verificado ? (
                <View className="flex-row items-center gap-1">
                  <Ionicons name="checkmark-circle" size={16} color="#059669" />
                  <Text className="text-xs text-emerald-700">Cuenta verificada</Text>
                </View>
              ) : (
                <Text className="text-xs text-amber-600">Cuenta sin verificar</Text>
              )}
            </View>
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={() => void salir()}
            className="mt-6 flex-row items-center justify-center gap-2 rounded-2xl border border-red-200 bg-white py-4 active:opacity-80"
          >
            <Ionicons name="log-out-outline" size={20} color="#DC2626" />
            <Text className="text-base font-semibold text-red-600">Cerrar sesión</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}
