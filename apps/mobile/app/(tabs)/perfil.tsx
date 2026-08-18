/**
 * GUI-09 Mi Perfil — HU-1.3 visualizar, HU-1.5 completar, HU-1.7 cierre de sesión.
 * El engranaje abre la edición. Las filas del menú se muestran pero no navegan
 * porque esas secciones todavía no están desarrolladas.
 */
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter, type Href } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Linking,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useToast } from '@/components/feedback/Toast';
import { useSesion } from '@/hooks/useSesion';
import { ApiError, urlAbsoluta } from '@/services/api';
import { obtenerPerfil } from '@/services/usuarios';
import type { Perfil } from '@/types/auth';

type NombreIcono = keyof typeof Ionicons.glyphMap;

const MENU: { icono: NombreIcono; label: string }[] = [
  { icono: 'paw-outline', label: 'Mis mascotas' },
  { icono: 'document-text-outline', label: 'Mis solicitudes' },
  { icono: 'heart-outline', label: 'Favoritos' },
  { icono: 'heart-circle-outline', label: 'Campañas' },
];

function iniciales(nombre?: string, apellido?: string): string {
  const n = nombre?.trim().charAt(0) ?? '';
  const a = apellido?.trim().charAt(0) ?? '';
  return `${n}${a}`.toUpperCase() || '?';
}

function etiquetaRol(roles: string[], esRefugio: boolean): string {
  if (roles.includes('ADMIN')) return 'Admin';
  if (esRefugio) return 'Refugio';
  return 'Adoptante';
}

function formatearValoracion(valor: number | null | undefined): string {
  if (valor === null || valor === undefined) return '—';
  return valor.toFixed(1);
}

export default function PerfilScreen() {
  const router = useRouter();
  const toast = useToast();
  const { usuario, token, esRefugio, actualizarUsuario, cerrarSesion } = useSesion();

  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [cargando, setCargando] = useState(true);

  const cargar = useCallback(async (): Promise<void> => {
    if (!token) return;
    try {
      const respuesta = await obtenerPerfil(token);
      setPerfil(respuesta.usuario);
      await actualizarUsuario(respuesta.usuario);
    } catch (error) {
      const mensaje =
        error instanceof ApiError
          ? error.mensaje
          : 'No pudimos cargar tu perfil. Revisá tu conexión.';
      toast.mostrarError(mensaje);
    } finally {
      setCargando(false);
    }
  }, [token, actualizarUsuario]);

  useFocusEffect(
    useCallback(() => {
      void cargar();
    }, [cargar]),
  );

  const salir = async (): Promise<void> => {
    await cerrarSesion();
    router.replace('/login');
  };

  const visible = perfil ?? usuario;
  const foto = urlAbsoluta(visible?.imagenUrl);
  const incompleto = !visible?.imagenUrl || !visible?.telefono || !visible?.ubicacion;

  return (
    <View className="flex-1 bg-pethood-beige">
      <SafeAreaView className="flex-1" edges={['top']}>
        <View className="flex-row items-center justify-between px-5 pb-2 pt-3">
          <Text className="text-2xl font-bold text-pethood-orange">Mi Perfil</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Editar perfil"
            onPress={() => router.push('/perfil/editar' as Href)}
            className="h-10 w-10 items-center justify-center rounded-full bg-white"
          >
            <Ionicons name="settings-outline" size={22} color="#FF9D5C" />
          </Pressable>
        </View>

        {cargando && !visible ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator color="#FF9D5C" />
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerClassName="px-5 pb-8 pt-2"
          >
            {incompleto ? (
              <Pressable
                onPress={() => router.push('/perfil/editar' as Href)}
                className="mb-4 rounded-2xl bg-orange-50 px-4 py-3"
              >
                <Text className="text-sm font-medium text-orange-800">
                  Completá tu perfil con foto e información personal
                </Text>
              </Pressable>
            ) : null}

            <View className="rounded-[28px] bg-white p-5 shadow-sm">
              <View className="flex-row items-center">
                {foto ? (
                  <Image
                    source={{ uri: foto }}
                    className="h-20 w-20 rounded-full"
                    accessibilityLabel="Foto de perfil"
                  />
                ) : (
                  <View className="h-20 w-20 items-center justify-center rounded-full bg-pethood-orange">
                    <Text className="text-2xl font-bold text-white">
                      {iniciales(visible?.nombre, visible?.apellido)}
                    </Text>
                  </View>
                )}

                <View className="ml-4 flex-1">
                  <Text className="text-xl font-bold text-gray-900">
                    {visible?.nombre} {visible?.apellido}
                  </Text>
                  {visible?.email ? (
                    <Pressable onPress={() => void Linking.openURL(`mailto:${visible.email}`)}>
                      <Text className="mt-0.5 text-sm text-violet-700 underline">
                        {visible.email}
                      </Text>
                    </Pressable>
                  ) : null}
                  <View className="mt-2 self-start rounded-full bg-orange-50 px-3 py-1">
                    <Text className="text-xs font-medium text-pethood-orange">
                      {etiquetaRol(visible?.roles ?? [], esRefugio)}
                    </Text>
                  </View>
                </View>
              </View>

              <View className="mt-5 flex-row border-t border-gray-100 pt-4">
                <View className="flex-1 items-center">
                  <Text className="text-xl font-bold text-pethood-orange">
                    {perfil?.mascotas ?? 0}
                  </Text>
                  <Text className="mt-0.5 text-xs text-gray-500">Mascotas</Text>
                </View>
                <View className="flex-1 items-center">
                  <Text className="text-xl font-bold text-pethood-orange">
                    {perfil?.favoritos ?? 0}
                  </Text>
                  <Text className="mt-0.5 text-xs text-gray-500">Favoritos</Text>
                </View>
                <View className="flex-1 items-center">
                  <Text className="text-xl font-bold text-pethood-orange">
                    {formatearValoracion(perfil?.valoracion)}
                  </Text>
                  <Text className="mt-0.5 text-xs text-gray-500">Valoración</Text>
                </View>
              </View>
            </View>

            <View className="mt-4 overflow-hidden rounded-[28px] bg-white shadow-sm">
              {MENU.map((item, index) => (
                <View
                  key={item.label}
                  className={`flex-row items-center px-4 py-3.5 ${
                    index < MENU.length - 1 ? 'border-b border-gray-100' : ''
                  }`}
                >
                  <View className="h-9 w-9 items-center justify-center rounded-xl bg-orange-50">
                    <Ionicons name={item.icono} size={18} color="#FF9D5C" />
                  </View>
                  <Text className="ml-3 flex-1 text-base text-gray-800">{item.label}</Text>
                  <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
                </View>
              ))}
            </View>

            <Pressable
              accessibilityRole="button"
              onPress={() => void salir()}
              className="mt-6 flex-row items-center justify-center gap-2 rounded-2xl border border-red-200 bg-white py-4 active:opacity-80"
            >
              <Ionicons name="log-out-outline" size={20} color="#DC2626" />
              <Text className="text-base font-semibold text-red-600">Cerrar sesión</Text>
            </Pressable>
          </ScrollView>
        )}
      </SafeAreaView>
    </View>
  );
}
