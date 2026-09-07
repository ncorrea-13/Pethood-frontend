/**
 * GUI-14 Conversación — HU-5.2: envío y recepción de mensajes en la sala de chat.
 *
 * Se entra desde el listado (GUI-08 / GUI-31), pero por la navegación viaja SÓLO el
 * `chatId`: el nombre y la foto del contacto los trae `GET /chats/:chatId`. Es a propósito
 * — así la pantalla también se puede abrir desde una notificación (HU-4.3) o un deep link,
 * que no pasan por el listado.
 *
 * El estado de los mensajes vive en `useSalaChat`; acá sólo se pinta.
 */
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BarraEscritura } from '@/components/chat/BarraEscritura';
import { BurbujaMensaje } from '@/components/chat/BurbujaMensaje';
import { CabeceraConversacion } from '@/components/chat/CabeceraConversacion';
import { EstadoCargando, EstadoError, EstadoVacio } from '@/components/feedback/EstadosPantalla';
import { PALETA } from '@/constants/theme';
import { useSalaChat } from '@/hooks/useSalaChat';
import { useSesion } from '@/hooks/useSesion';
import { abrirSelectorImagen, validarAssetImagen } from '@/lib/elegirImagen';
import type { ItemChat } from '@/lib/mensajesChat';
import type { ArchivoAdjunto } from '@/services/api';

const EXTENSION_POR_TIPO: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

/** Algunos Android devuelven 'image/jpg', que no es un MIME real. */
function normalizarTipo(tipo?: string | null): string {
  const minuscula = tipo?.toLowerCase().trim() ?? '';
  return minuscula === 'image/jpg' ? 'image/jpeg' : minuscula || 'image/jpeg';
}

export default function ConversacionScreen() {
  const router = useRouter();
  const { usuario, token } = useSesion();
  const { chatId: parametro } = useLocalSearchParams<{ chatId: string }>();
  const chatId = Number(parametro);

  const [foto, setFoto] = useState<ArchivoAdjunto | null>(null);

  const sala = useSalaChat(chatId, usuario?.id ?? 0, token);

  /**
   * Criterio 6: el clip abre el explorador nativo. Se reusa el selector del proyecto, que
   * ya resuelve el menú Cámara/Galería, los permisos y el caso web.
   */
  const elegirFoto = useCallback((): void => {
    abrirSelectorImagen({
      titulo: 'Adjuntar una foto',
      mensaje: '¿De dónde querés sacarla?',
      opciones: { mediaTypes: ['images'], quality: 0.8 },
      onElegida: (asset) => {
        // Validación de UX nada más: el backend valida igual formato y peso.
        const problema = validarAssetImagen(asset);
        if (problema) {
          Alert.alert('No pudimos adjuntarla', problema);
          return;
        }

        const tipo = normalizarTipo(asset.mimeType);
        setFoto({
          uri: asset.uri,
          nombre: asset.fileName ?? `mensaje.${EXTENSION_POR_TIPO[tipo] ?? 'jpg'}`,
          tipo,
        });
      },
      onErrorPermisoGaleria: (mensaje) => Alert.alert('Necesitamos tus fotos', mensaje),
      onErrorPermisoCamara: () =>
        Alert.alert(
          'Necesitamos la cámara',
          'Dale permiso a PetHood para usar la cámara, o elegí una foto de la galería.',
        ),
    });
  }, []);

  const enviar = useCallback(
    (contenido: string): void => {
      sala.enviar(contenido, foto);
      // La foto se suelta junto con el texto: ya viajó al pendiente, que conserva su copia
      // para poder reintentar.
      setFoto(null);
    },
    [sala, foto],
  );

  const renderItem = useCallback(
    ({ item }: { item: ItemChat }) => (
      <View className="mb-3">
        <BurbujaMensaje
          item={item}
          onReintentar={() => sala.reintentar(item.clave)}
          onDescartar={() => sala.descartar(item.clave)}
        />
      </View>
    ),
    [sala],
  );

  const volver = useCallback((): void => {
    if (router.canGoBack()) router.back();
    else router.replace('/(tabs)/chat');
  }, [router]);

  return (
    <View className="flex-1 bg-pethood-beige">
      <SafeAreaView className="flex-1" edges={['top']}>
        <CabeceraConversacion
          contacto={sala.cabecera?.contacto ?? null}
          enLinea={sala.enLinea}
          desconectado={sala.desconectado}
          onVolver={volver}
        />

        <KeyboardAvoidingView
          className="flex-1"
          // En iOS el teclado se superpone y hay que empujar la vista. En Android el
          // sistema ya redimensiona la ventana (`adjustResize`), así que empujar de nuevo
          // dejaría un hueco del alto del teclado.
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          {sala.cargando ? (
            <EstadoCargando />
          ) : sala.error ? (
            <EstadoError mensaje={sala.error} onAccion={sala.recargar} />
          ) : (
            <FlatList
              data={sala.items}
              keyExtractor={(item) => item.clave}
              renderItem={renderItem}
              // La lista va invertida: el scroll arranca abajo sin trucos y el backend ya
              // devuelve los mensajes del más reciente al más viejo, así que no hay que
              // dar vuelta nada.
              inverted={sala.items.length > 0}
              contentContainerStyle={
                sala.items.length === 0
                  ? { flexGrow: 1 }
                  : { paddingHorizontal: 16, paddingVertical: 14 }
              }
              // Con la lista invertida, el "final" de los datos es el mensaje más viejo:
              // o sea, el tope visual. Paginar acá es cargar hacia atrás en el tiempo.
              onEndReached={sala.cargarMasViejos}
              onEndReachedThreshold={0.4}
              ListFooterComponent={
                sala.cargandoMas ? (
                  <View className="py-3">
                    <ActivityIndicator color={PALETA.pethood.naranja} />
                  </View>
                ) : null
              }
              ListEmptyComponent={
                <EstadoVacio
                  icono="chatbubble-ellipses-outline"
                  titulo="Todavía no hay mensajes"
                  descripcion="Escribí el primero para empezar la conversación."
                />
              }
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="on-drag"
            />
          )}

          {/* La barra se muestra aunque el historial esté cargando o haya fallado: el
              usuario puede escribir igual, y el envío no depende de haber podido leer. */}
          <BarraEscritura
            foto={foto}
            onElegirFoto={elegirFoto}
            onQuitarFoto={() => setFoto(null)}
            onEnviar={enviar}
            habilitada={sala.puedeEscribir}
          />

          {sala.puedeEscribir ? null : (
            <View className="flex-row items-center justify-center gap-1.5 bg-white px-4 pb-2">
              <Ionicons name="information-circle-outline" size={13} color={PALETA.neutral[500]} />
              <Text className="text-xs text-organic-neutral-500">
                Esta cuenta fue dada de baja. Podés leer la conversación, pero no responder.
              </Text>
            </View>
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
