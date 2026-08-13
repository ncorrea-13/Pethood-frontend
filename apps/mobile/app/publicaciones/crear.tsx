/**
 * GUI-24 Nueva publicación de adopción — PENDIENTE.
 *
 * La mascota ya quedó creada y asociada al usuario antes de llegar acá. Falta el
 * formulario de la publicación (descripción, requisitos del adoptante como etiquetas y
 * ubicación) y el endpoint POST /publicaciones. Los campos ya existen en el modelo de
 * datos: publicacion_descripcion, publicacion_requisitos y publicacion_ubicacion.
 */
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CustomButton } from '@/components/CustomButton';

export default function CrearPublicacionScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-pethood-beige">
      <SafeAreaView className="flex-1 items-center justify-center px-8" edges={['top']}>
        <Ionicons name="megaphone-outline" size={48} color="#FF9D5C" />

        <Text className="mt-4 text-center text-xl font-bold text-gray-900">
          Publicación en adopción
        </Text>
        <Text className="mt-2 text-center text-base text-gray-600">
          Tu mascota ya quedó creada. Esta pantalla todavía está en construcción.
        </Text>

        <View className="mt-8 w-full">
          <CustomButton title="Volver a mis mascotas" onPress={() => router.replace('/(tabs)')} />
        </View>
      </SafeAreaView>
    </View>
  );
}
