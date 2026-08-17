/** GUI-04 Mascotas Adoptante — listado de las mascotas propias y acceso a la creación. */
import { Ionicons } from '@expo/vector-icons';
import { Link, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Pressable, RefreshControl, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useSesion } from '@/hooks/useSesion';
import { urlAbsoluta } from '@/services/api';
import { listarMisMascotas, type Mascota } from '@/services/mascotas';
import { aFechaVisible, parsearFecha } from '@/shared/validation/dates';

const ETIQUETA_TAMANIO = {
  PEQUENO: 'Pequeño',
  MEDIANO: 'Mediano',
  GRANDE: 'Grande',
} as const;

/** Los estados llegan del catálogo con guiones bajos. */
function etiquetaEstado(nombre: string): string {
  return nombre.replace(/_/g, ' ');
}

function edad(fechaNacimiento: string | null): string | null {
  const fecha = parsearFecha(fechaNacimiento);
  return fecha ? aFechaVisible(fecha) : null;
}

function TarjetaMascota({ mascota }: { mascota: Mascota }) {
  const foto = urlAbsoluta(mascota.imagenUrl);

  return (
    <View className="mb-3 flex-row gap-3 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm">
      {foto ? (
        <Image source={{ uri: foto }} className="h-28 w-28 rounded-xl" />
      ) : (
        <View className="h-28 w-28 items-center justify-center rounded-xl bg-gray-100">
          <Ionicons name="paw-outline" size={28} color="#9CA3AF" />
        </View>
      )}

      <View className="flex-1 justify-center">
        <Text className="text-base font-bold text-gray-900">{mascota.nombre}</Text>
        <Text className="mt-0.5 text-sm text-gray-600">
          {mascota.especie.nombre} · {mascota.raza.nombre}
        </Text>
        <Text className="mt-0.5 text-sm text-gray-600">
          {mascota.genero === 'MACHO' ? 'Macho' : 'Hembra'}
          {mascota.tamanio ? ` · ${ETIQUETA_TAMANIO[mascota.tamanio]}` : ''}
          {mascota.peso === null ? '' : ` · ${mascota.peso} kg`}
        </Text>

        <View className="mt-2 flex-row items-center gap-2">
          <View className="self-start rounded-full border border-orange-100 bg-orange-50 px-2 py-1">
            <Text className="text-xs text-orange-700">{etiquetaEstado(mascota.estado.nombre)}</Text>
          </View>
          {edad(mascota.fechaNacimiento) ? (
            <Text className="text-xs text-gray-400">{edad(mascota.fechaNacimiento)}</Text>
          ) : null}
        </View>
      </View>
    </View>
  );
}

function ListaVacia() {
  return (
    <View className="items-center px-8 py-16">
      <View className="mb-5 h-24 w-24 items-center justify-center rounded-full bg-white">
        <Ionicons name="paw-outline" size={44} color="#FF9D5C" />
      </View>

      <Text className="text-center text-lg font-bold text-gray-900">
        Todavía no tenés ninguna mascota
      </Text>
      <Text className="mt-2 text-center text-base leading-6 text-gray-500">
        Registrá la primera para tenerla en tu perfil o para publicarla en adopción.
      </Text>

      <View className="mt-5 flex-row items-center gap-2 rounded-full bg-white px-4 py-2.5">
        <View className="h-7 w-7 items-center justify-center rounded-full bg-pethood-orange">
          <Ionicons name="add" size={18} color="#FFFFFF" />
        </View>
        <Text className="text-sm text-gray-600">Tocá el botón para empezar</Text>
      </View>
    </View>
  );
}

export default function MisMascotasScreen() {
  const { esRefugio } = useSesion();

  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [cargando, setCargando] = useState(true);
  const [refrescando, setRefrescando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async (): Promise<void> => {
    try {
      setError(null);
      setMascotas(await listarMisMascotas());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No pudimos cargar tus mascotas.');
    } finally {
      setCargando(false);
      setRefrescando(false);
    }
  }, []);

  // Se recarga al volver de crear una mascota, para que aparezca la recién creada.
  useFocusEffect(
    useCallback(() => {
      void cargar();
    }, [cargar]),
  );

  return (
    <View className="flex-1 bg-pethood-beige">
      <SafeAreaView className="flex-1" edges={['top']}>
        <View className="border-b border-gray-200 bg-white px-5 py-4">
          <Text className="text-xl font-bold text-gray-900">Mis mascotas</Text>
          <Text className="text-sm text-gray-600">
            {cargando ? 'Cargando…' : `${mascotas.length} ${mascotas.length === 1 ? 'mascota' : 'mascotas'}`}
          </Text>
        </View>

        {cargando ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#FF9D5C" />
          </View>
        ) : error ? (
          <View className="flex-1 items-center justify-center px-6">
            <Ionicons name="cloud-offline-outline" size={40} color="#9CA3AF" />
            <Text className="mt-3 text-center text-base text-gray-600">{error}</Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => {
                setCargando(true);
                void cargar();
              }}
              className="mt-4 rounded-full bg-pethood-orange px-6 py-2 active:opacity-90"
            >
              <Text className="font-medium text-white">Reintentar</Text>
            </Pressable>
          </View>
        ) : (
          <FlatList
            data={mascotas}
            keyExtractor={(mascota) => String(mascota.id)}
            renderItem={({ item }) => <TarjetaMascota mascota={item} />}
            ListEmptyComponent={ListaVacia}
            contentContainerClassName="px-5 py-4 pb-28"
            refreshControl={
              <RefreshControl
                refreshing={refrescando}
                onRefresh={() => {
                  setRefrescando(true);
                  void cargar();
                }}
                tintColor="#FF9D5C"
              />
            }
          />
        )}

        {/* Burbuja de creación: lleva al formulario de alta. */}
        <Link href="/mascotas/crear" asChild>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={esRefugio ? 'Crear mascota del refugio' : 'Crear mascota'}
            className="absolute bottom-6 right-6 h-16 w-16 items-center justify-center rounded-full bg-pethood-orange shadow-lg active:opacity-90"
          >
            <Ionicons name="add" size={32} color="#FFFFFF" />
          </Pressable>
        </Link>
      </SafeAreaView>
    </View>
  );
}
