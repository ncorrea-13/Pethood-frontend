/**
 * GUI-27 Solicitudes — HU-7.5 bandeja de quien publicó la mascota, HU-7.4 aceptar/rechazar.
 *
 * "Quien publicó la mascota" no es siempre un refugio (spec 003 §6.2): un adoptante
 * particular que ofreció una mascota propia también entra acá a resolver lo que le llega.
 *
 * Arranca filtrando por "Pendiente" — es lo único que requiere acción — y deja elegir otro
 * estado o "Todas" con los chips. HU-7.1/7.3 (crear solicitud, historial propio del
 * adoptante) todavía no tienen endpoint: esta pantalla es solo el lado de resolver.
 */
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, Image, Pressable, RefreshControl, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EstadoCargando, EstadoError, EstadoVacio } from '@/components/feedback/EstadosPantalla';
import { useToast } from '@/components/feedback/Toast';
import { ResolverSolicitudModal } from '@/components/solicitudes/ResolverSolicitudModal';
import { EstadoSolicitudBadge } from '@/components/ui/EstadoSolicitudBadge';
import { SelectorChips } from '@/components/ui/SelectorChips';
import { PALETA } from '@/constants/theme';
import { ApiError, urlAbsoluta } from '@/services/api';
import {
  listarRecibidas,
  resolverSolicitud,
  type EstadoResolucion,
  type EstadoSolicitudNombre,
  type SolicitudResumen,
} from '@/services/solicitudes';
import { aFechaVisible, parsearFecha } from '@/shared/validation/dates';

const OPCIONES_ESTADO: { valor: EstadoSolicitudNombre; etiqueta: string }[] = [
  { valor: 'Pendiente', etiqueta: 'Pendientes' },
  { valor: 'En_Revision', etiqueta: 'En revisión' },
  { valor: 'Aprobada', etiqueta: 'Aprobadas' },
  { valor: 'Rechazada', etiqueta: 'Rechazadas' },
  { valor: 'Cancelada', etiqueta: 'Canceladas' },
];

function subtitulo(total: number, filtro: EstadoSolicitudNombre | undefined): string {
  if (filtro === 'Pendiente') {
    return total === 0 ? 'Ninguna pendiente' : `${total} pendiente${total === 1 ? '' : 's'}`;
  }
  if (total === 0) return 'Sin resultados';
  return `${total} solicitud${total === 1 ? '' : 'es'}`;
}

interface TarjetaSolicitudProps {
  solicitud: SolicitudResumen;
  onVerDetalle: () => void;
  onResolver: (accion: EstadoResolucion) => void;
}

function TarjetaSolicitud({ solicitud, onVerDetalle, onResolver }: TarjetaSolicitudProps) {
  const foto = urlAbsoluta(solicitud.mascota.imagenUrl);
  const fecha = parsearFecha(solicitud.fechaAlta);
  const esPendiente = solicitud.estado.nombre === 'Pendiente';

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onVerDetalle}
      className="mb-3 overflow-hidden rounded-2xl bg-white shadow-sm active:opacity-90"
    >
      <View className="flex-row items-center gap-3 p-3">
        {foto ? (
          <Image source={{ uri: foto }} className="h-12 w-12 rounded-xl" />
        ) : (
          <View className="h-12 w-12 items-center justify-center rounded-xl bg-orange-50">
            <Ionicons name="paw-outline" size={20} color={PALETA.pethood.naranja} />
          </View>
        )}

        <View className="flex-1">
          <Text className="text-sm font-bold text-gray-900">
            {solicitud.mascota.nombre ?? 'Sin nombre'}
          </Text>
          <Text className="mt-0.5 text-xs text-gray-500">
            {solicitud.solicitante.nombre} {solicitud.solicitante.apellido}
            {fecha ? ` · ${aFechaVisible(fecha)}` : ''}
          </Text>
        </View>

        <EstadoSolicitudBadge estado={solicitud.estado.nombre} />
      </View>

      {esPendiente ? (
        <View className="flex-row gap-2 border-t border-gray-100 px-3 pb-3 pt-2.5">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Aceptar la solicitud de ${solicitud.solicitante.nombre}`}
            onPress={() => onResolver('Aprobada')}
            className="flex-1 flex-row items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-2.5 active:opacity-90"
          >
            <Ionicons name="checkmark" size={15} color={PALETA.blanco} />
            <Text className="text-sm font-semibold text-white">Aceptar</Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Rechazar la solicitud de ${solicitud.solicitante.nombre}`}
            onPress={() => onResolver('Rechazada')}
            className="flex-1 items-center justify-center rounded-xl bg-gray-100 py-2.5 active:opacity-80"
          >
            <Text className="text-sm font-semibold text-gray-600">Rechazar</Text>
          </Pressable>
        </View>
      ) : null}
    </Pressable>
  );
}

export default function SolicitudesScreen() {
  const router = useRouter();
  const toast = useToast();

  const [filtro, setFiltro] = useState<EstadoSolicitudNombre | undefined>('Pendiente');
  const [solicitudes, setSolicitudes] = useState<SolicitudResumen[]>([]);
  const [total, setTotal] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [refrescando, setRefrescando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** Solicitud + acción esperando confirmación; `null` cierra el modal. */
  const [aResolver, setAResolver] = useState<{ solicitud: SolicitudResumen; accion: EstadoResolucion } | null>(
    null,
  );
  const [resolviendo, setResolviendo] = useState(false);

  const cargar = useCallback(async (): Promise<void> => {
    try {
      setError(null);
      const respuesta = await listarRecibidas(filtro);
      setSolicitudes(respuesta.solicitudes);
      setTotal(respuesta.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No pudimos cargar las solicitudes.');
    } finally {
      setCargando(false);
      setRefrescando(false);
    }
  }, [filtro]);

  useFocusEffect(
    useCallback(() => {
      setCargando(true);
      void cargar();
    }, [cargar]),
  );

  const confirmarResolucion = async (comentario: string): Promise<void> => {
    if (!aResolver) return;
    const { solicitud, accion } = aResolver;

    setResolviendo(true);
    try {
      await resolverSolicitud(solicitud.id, accion, comentario);
      setAResolver(null);
      toast.mostrarExito(
        accion === 'Aprobada'
          ? `Aceptaste la solicitud de ${solicitud.solicitante.nombre}.`
          : `Rechazaste la solicitud de ${solicitud.solicitante.nombre}.`,
      );
      await cargar();
    } catch (err) {
      setAResolver(null);

      // 409: alguien más (otro miembro del refugio, o el cron de HU-7.6) ya la resolvió.
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

  return (
    <View className="flex-1 bg-pethood-beige">
      <SafeAreaView className="flex-1" edges={['top']}>
        <View className="border-b border-gray-200 bg-white/85 px-3.5 py-2.5">
          <View className="flex-row items-center gap-2.5">
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Volver"
              onPress={() => (router.canGoBack() ? router.back() : router.replace('/(tabs)/perfil'))}
              hitSlop={10}
              className="h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white active:opacity-70"
            >
              <Ionicons name="arrow-back" size={18} color={PALETA.grisCalido[700]} />
            </Pressable>

            <View>
              <Text className="text-xl font-bold text-pethood-orange">Solicitudes</Text>
              <Text className="mt-0.5 text-xs text-gray-500">
                {cargando ? 'Cargando…' : subtitulo(total, filtro)}
              </Text>
            </View>
          </View>

          <View className="mt-3">
            <SelectorChips
              prefijo="estado-solicitud"
              opciones={OPCIONES_ESTADO}
              valor={filtro}
              etiquetaSinFiltro="Todas"
              onChange={setFiltro}
            />
          </View>
        </View>

        {cargando ? (
          <EstadoCargando />
        ) : error ? (
          <EstadoError
            mensaje={error}
            onAccion={() => {
              setCargando(true);
              void cargar();
            }}
          />
        ) : (
          <FlatList
            data={solicitudes}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
              <TarjetaSolicitud
                solicitud={item}
                onVerDetalle={() =>
                  router.push({ pathname: '/solicitudes/[id]', params: { id: item.id } })
                }
                onResolver={(accion) => setAResolver({ solicitud: item, accion })}
              />
            )}
            ListEmptyComponent={
              <EstadoVacio
                icono="file-tray-outline"
                titulo={filtro === 'Pendiente' ? 'No tenés solicitudes pendientes' : 'No hay solicitudes'}
                descripcion={
                  filtro === 'Pendiente'
                    ? 'Cuando alguien pida adoptar una de tus mascotas, va a aparecer acá.'
                    : 'Probá con otro estado en los filtros de arriba.'
                }
              />
            }
            contentContainerClassName="px-3.5 py-3.5 pb-10"
            refreshControl={
              <RefreshControl
                refreshing={refrescando}
                onRefresh={() => {
                  setRefrescando(true);
                  void cargar();
                }}
                tintColor={PALETA.pethood.naranja}
              />
            }
          />
        )}
      </SafeAreaView>

      <ResolverSolicitudModal
        accion={aResolver?.accion ?? null}
        nombreSolicitante={aResolver?.solicitud.solicitante.nombre ?? ''}
        nombreMascota={aResolver?.solicitud.mascota.nombre ?? null}
        cargando={resolviendo}
        onConfirmar={(comentario) => void confirmarResolucion(comentario)}
        onCerrar={() => setAResolver(null)}
      />
    </View>
  );
}
