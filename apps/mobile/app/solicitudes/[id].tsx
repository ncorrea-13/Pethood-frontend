/**
 * GUI-27 detalle — HU-7.5: histórico completo de una solicitud recibida, HU-7.4: aceptar
 * o rechazar desde acá. Mismo "quien puede resolver" que el listado (spec 003 §6.2).
 */
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EstadoCargando, EstadoError } from '@/components/feedback/EstadosPantalla';
import { useToast } from '@/components/feedback/Toast';
import { ResolverSolicitudModal } from '@/components/solicitudes/ResolverSolicitudModal';
import { Avatar } from '@/components/ui/Avatar';
import { EstadoSolicitudBadge } from '@/components/ui/EstadoSolicitudBadge';
import { SeccionTitulada } from '@/components/ui/SeccionTitulada';
import { PALETA } from '@/constants/theme';
import { ApiError, urlAbsoluta } from '@/services/api';
import {
  obtenerSolicitud,
  resolverSolicitud,
  type EstadoResolucion,
  type SolicitudDetalle,
} from '@/services/solicitudes';
import { aFechaVisible, parsearFecha } from '@/shared/validation/dates';

const ETIQUETA_TIPO: Record<string, string> = {
  Adopcion: 'Adopción',
  Transito: 'Tránsito',
};

function fechaLarga(iso: string | null): string | null {
  const fecha = parsearFecha(iso);
  return fecha ? aFechaVisible(fecha) : null;
}

export default function DetalleSolicitudScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const solicitudId = Number(id);
  const router = useRouter();
  const toast = useToast();

  const [solicitud, setSolicitud] = useState<SolicitudDetalle | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accion, setAccion] = useState<EstadoResolucion | null>(null);
  const [resolviendo, setResolviendo] = useState(false);

  const cargar = useCallback(async (): Promise<void> => {
    try {
      setError(null);
      setSolicitud(await obtenerSolicitud(solicitudId));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'No pudimos cargar el detalle de la solicitud.',
      );
    } finally {
      setCargando(false);
    }
  }, [solicitudId]);

  useFocusEffect(
    useCallback(() => {
      setCargando(true);
      void cargar();
    }, [cargar]),
  );

  const confirmarResolucion = async (comentario: string): Promise<void> => {
    if (!solicitud || !accion) return;

    setResolviendo(true);
    try {
      const actualizada = await resolverSolicitud(solicitud.id, accion, comentario);
      setSolicitud(actualizada);
      setAccion(null);
      toast.mostrarExito(
        accion === 'Aprobada' ? 'Aceptaste la solicitud.' : 'Rechazaste la solicitud.',
      );
    } catch (err) {
      setAccion(null);

      if (err instanceof ApiError && err.codigo === 'SOLICITUD_YA_RESUELTA') {
        toast.mostrarAdvertencia(err.mensaje);
        await cargar();
        return;
      }

      toast.mostrarError(
        err instanceof Error ? err.message : 'No pudimos actualizar la solicitud. Intentalo de nuevo.',
      );
    } finally {
      setResolviendo(false);
    }
  };

  const foto = urlAbsoluta(solicitud?.mascota.imagenUrl);
  const esPendiente = solicitud?.estado.nombre === 'Pendiente';

  return (
    <View className="flex-1 bg-pethood-beige">
      <SafeAreaView className="flex-1" edges={['top']}>
        <View className="flex-row items-center gap-2.5 border-b border-gray-200 bg-white/85 px-3.5 py-2.5">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Volver"
            onPress={() => (router.canGoBack() ? router.back() : router.replace('/solicitudes'))}
            hitSlop={10}
            className="h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white active:opacity-70"
          >
            <Ionicons name="arrow-back" size={18} color={PALETA.grisCalido[700]} />
          </Pressable>

          <View>
            <Text className="text-xl font-bold text-pethood-orange">Solicitud</Text>
            {solicitud?.mascota.nombre ? (
              <Text className="mt-0.5 text-xs text-gray-500">{solicitud.mascota.nombre}</Text>
            ) : null}
          </View>
        </View>

        {cargando ? (
          <EstadoCargando />
        ) : error || !solicitud ? (
          <EstadoError
            mensaje={error ?? 'No encontramos esta solicitud.'}
            onAccion={() => {
              setCargando(true);
              void cargar();
            }}
          />
        ) : (
          <ScrollView contentContainerClassName="px-4 py-4 pb-10">
            <View className="flex-row items-center gap-3 rounded-2xl bg-white p-3 shadow-sm">
              {foto ? (
                <Image source={{ uri: foto }} className="h-16 w-16 rounded-xl" />
              ) : (
                <View className="h-16 w-16 items-center justify-center rounded-xl bg-orange-50">
                  <Ionicons name="paw-outline" size={26} color={PALETA.pethood.naranja} />
                </View>
              )}

              <View className="flex-1">
                <Text className="text-base font-bold text-gray-900">
                  {solicitud.mascota.nombre ?? 'Sin nombre'}
                </Text>
                <Text className="mt-0.5 text-xs text-gray-500">
                  {ETIQUETA_TIPO[solicitud.tipoSolicitud] ?? solicitud.tipoSolicitud}
                </Text>
              </View>

              <EstadoSolicitudBadge estado={solicitud.estado.nombre} />
            </View>

            <SeccionTitulada titulo="Solicitante" className="mt-5">
              <View className="flex-row items-center gap-3 rounded-2xl bg-white p-3 shadow-sm">
                <Avatar
                  tamanio={40}
                  nombre={solicitud.solicitante.nombre}
                  apellido={solicitud.solicitante.apellido}
                />
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-gray-900">
                    {solicitud.solicitante.nombre} {solicitud.solicitante.apellido}
                  </Text>
                  <Text className="mt-0.5 text-xs text-gray-500">
                    Solicitó el {fechaLarga(solicitud.fechaAlta)}
                  </Text>
                </View>
              </View>
            </SeccionTitulada>

            {solicitud.motivacion ? (
              <SeccionTitulada titulo="Motivo de la solicitud" className="mt-5">
                <View className="rounded-2xl bg-white p-3.5 shadow-sm">
                  <Text className="text-sm leading-5 text-gray-700">{solicitud.motivacion}</Text>
                </View>
              </SeccionTitulada>
            ) : null}

            {solicitud.comentario ? (
              <SeccionTitulada titulo="Tu respuesta" className="mt-5">
                <View className="rounded-2xl bg-white p-3.5 shadow-sm">
                  <Text className="text-sm leading-5 text-gray-700">{solicitud.comentario}</Text>
                </View>
              </SeccionTitulada>
            ) : null}

            <SeccionTitulada titulo="Historial" className="mt-5">
              <View className="rounded-2xl bg-white p-3.5 shadow-sm">
                {solicitud.historial.map((paso, index) => (
                  <View
                    key={paso.id}
                    className={`flex-row items-center justify-between ${
                      index < solicitud.historial.length - 1 ? 'mb-2.5 border-b border-gray-100 pb-2.5' : ''
                    }`}
                  >
                    <EstadoSolicitudBadge estado={paso.nombre} />
                    <Text className="text-xs text-gray-500">{fechaLarga(paso.fecha)}</Text>
                  </View>
                ))}
              </View>
            </SeccionTitulada>

            {esPendiente ? (
              <View className="mt-6 flex-row gap-2.5">
                <Pressable
                  accessibilityRole="button"
                  onPress={() => setAccion('Aprobada')}
                  className="flex-1 flex-row items-center justify-center gap-1.5 rounded-2xl bg-emerald-600 py-3.5 active:opacity-90"
                >
                  <Ionicons name="checkmark" size={16} color={PALETA.blanco} />
                  <Text className="text-base font-semibold text-white">Aceptar</Text>
                </Pressable>

                <Pressable
                  accessibilityRole="button"
                  onPress={() => setAccion('Rechazada')}
                  className="flex-1 items-center justify-center rounded-2xl bg-gray-100 py-3.5 active:opacity-80"
                >
                  <Text className="text-base font-semibold text-gray-600">Rechazar</Text>
                </Pressable>
              </View>
            ) : null}
          </ScrollView>
        )}
      </SafeAreaView>

      <ResolverSolicitudModal
        accion={accion}
        nombreSolicitante={solicitud?.solicitante.nombre ?? ''}
        nombreMascota={solicitud?.mascota.nombre ?? null}
        cargando={resolviendo}
        onConfirmar={(comentario) => void confirmarResolucion(comentario)}
        onCerrar={() => setAccion(null)}
      />
    </View>
  );
}
