/**
 * Modal de confirmación para acciones críticas (regla transversal 6 de CLAUDE.md) y para
 * bloqueos que el usuario no puede resolver desde donde está.
 *
 * Reemplaza a `Alert.alert` en los flujos con identidad visual propia: el nativo no admite
 * la paleta ni la tipografía de PetHood. Se sigue usando `Alert.alert` para lo accesorio,
 * como la elección de cámara o galería en PhotoPicker.
 *
 * Dos modos según se pase o no `onConfirmar`:
 * - con `onConfirmar`: Cancelar + acción, para confirmar algo irreversible.
 * - sin `onConfirmar`: un único "Entendido", para informar un bloqueo sin salida.
 */
import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Modal, Pressable, Text, View } from 'react-native';

export type TonoDialogo = 'peligro' | 'advertencia';

interface ConfirmDialogProps {
  visible: boolean;
  tono?: TonoDialogo;
  titulo: string;
  mensaje: string;
  /** Segunda línea, para explicar el siguiente paso cuando el mensaje solo describe el bloqueo. */
  detalle?: string;
  textoConfirmar?: string;
  textoCancelar?: string;
  /** Sin este handler el diálogo es informativo y muestra un solo botón. */
  onConfirmar?: () => void;
  onCerrar: () => void;
  cargando?: boolean;
}

const ESTILOS: Record<TonoDialogo, { icono: keyof typeof Ionicons.glyphMap; color: string; fondo: string; boton: string }> = {
  peligro: { icono: 'trash-outline', color: '#DC2626', fondo: 'bg-red-50', boton: 'bg-red-600' },
  advertencia: {
    icono: 'alert-circle-outline',
    color: '#D97706',
    fondo: 'bg-amber-50',
    boton: 'bg-amber-500',
  },
};

export function ConfirmDialog({
  visible,
  tono = 'peligro',
  titulo,
  mensaje,
  detalle,
  textoConfirmar = 'Confirmar',
  textoCancelar = 'Cancelar',
  onConfirmar,
  onCerrar,
  cargando = false,
}: ConfirmDialogProps) {
  const estilo = ESTILOS[tono];
  const esInformativo = onConfirmar === undefined;

  // Mientras la acción está en curso el diálogo no se puede cerrar por atrás ni por el fondo,
  // para no dejar una petición huérfana sin feedback.
  const cerrarSiSePuede = (): void => {
    if (!cargando) onCerrar();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={cerrarSiSePuede}>
      <Pressable
        className="flex-1 items-center justify-center bg-black/40 px-8"
        onPress={cerrarSiSePuede}
        accessibilityRole="button"
        accessibilityLabel="Cerrar"
      >
        <Pressable
          className="w-full rounded-3xl bg-white p-6"
          onPress={() => undefined}
          accessibilityViewIsModal
        >
          <View className={`mb-4 h-14 w-14 items-center justify-center self-center rounded-full ${estilo.fondo}`}>
            <Ionicons name={estilo.icono} size={28} color={estilo.color} />
          </View>

          <Text className="text-center text-lg font-bold text-gray-900">{titulo}</Text>
          <Text className="mt-2 text-center text-base leading-6 text-gray-600">{mensaje}</Text>

          {detalle ? (
            <Text className="mt-3 text-center text-sm leading-5 text-gray-500">{detalle}</Text>
          ) : null}

          <View className={`mt-6 gap-3 ${esInformativo ? '' : 'flex-row'}`}>
            {esInformativo ? (
              <Pressable
                accessibilityRole="button"
                onPress={onCerrar}
                className="items-center justify-center rounded-2xl bg-pethood-orange py-3.5 active:opacity-90"
              >
                <Text className="text-base font-semibold text-white">Entendido</Text>
              </Pressable>
            ) : (
              <>
                <Pressable
                  accessibilityRole="button"
                  disabled={cargando}
                  onPress={onCerrar}
                  className="flex-1 items-center justify-center rounded-2xl border border-gray-300 py-3.5 active:opacity-80"
                >
                  <Text className="text-base font-semibold text-gray-700">{textoCancelar}</Text>
                </Pressable>

                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ busy: cargando }}
                  disabled={cargando}
                  onPress={onConfirmar}
                  className={`flex-1 items-center justify-center rounded-2xl py-3.5 active:opacity-90 ${estilo.boton} ${cargando ? 'opacity-60' : ''}`}
                >
                  {cargando ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text className="text-base font-semibold text-white">{textoConfirmar}</Text>
                  )}
                </Pressable>
              </>
            )}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
