/**
 * Toasts reutilizables de éxito, advertencia y error. Todos los textos que se les pasan
 * van en voseo rioplatense.
 *
 * Se usan vía el hook `useToast()`; el provider vive en el layout raíz para que un toast
 * disparado antes de navegar siga visible en la pantalla siguiente.
 */
import { Ionicons } from '@expo/vector-icons';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export type TipoToast = 'exito' | 'advertencia' | 'error';

interface Toast {
  id: number;
  tipo: TipoToast;
  mensaje: string;
}

interface ContextoToast {
  mostrarExito: (mensaje: string) => void;
  mostrarAdvertencia: (mensaje: string) => void;
  mostrarError: (mensaje: string) => void;
}

const DURACION_MS = 4000;

const ESTILOS: Record<TipoToast, { fondo: string; icono: keyof typeof Ionicons.glyphMap }> = {
  exito: { fondo: 'bg-emerald-600', icono: 'checkmark-circle' },
  advertencia: { fondo: 'bg-amber-500', icono: 'alert-circle' },
  error: { fondo: 'bg-red-600', icono: 'close-circle' },
};

const Contexto = createContext<ContextoToast | null>(null);

export function useToast(): ContextoToast {
  const contexto = useContext(Contexto);

  if (!contexto) {
    throw new Error('useToast necesita estar dentro de <ToastProvider>');
  }

  return contexto;
}

function ToastVisible({ toast, onCerrar }: { toast: Toast; onCerrar: () => void }) {
  const opacidad = useRef(new Animated.Value(0)).current;
  const estilo = ESTILOS[toast.tipo];

  useEffect(() => {
    Animated.timing(opacidad, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [opacidad]);

  return (
    <Animated.View style={{ opacity: opacidad }} className="mb-2">
      <Pressable
        onPress={onCerrar}
        accessibilityRole="alert"
        className={`flex-row items-center rounded-2xl px-4 py-3.5 shadow-lg ${estilo.fondo}`}
      >
        <Ionicons name={estilo.icono} size={22} color="#FFFFFF" />
        <Text className="ml-3 flex-1 text-base font-medium text-white">{toast.mensaje}</Text>
      </Pressable>
    </Animated.View>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const siguienteId = useRef(0);

  const cerrar = useCallback((id: number) => {
    setToasts((actuales) => actuales.filter((toast) => toast.id !== id));
  }, []);

  const mostrar = useCallback(
    (tipo: TipoToast, mensaje: string) => {
      const id = siguienteId.current++;

      setToasts((actuales) => [...actuales, { id, tipo, mensaje }]);
      setTimeout(() => cerrar(id), DURACION_MS);
    },
    [cerrar],
  );

  const valor = useMemo<ContextoToast>(
    () => ({
      mostrarExito: (mensaje) => mostrar('exito', mensaje),
      mostrarAdvertencia: (mensaje) => mostrar('advertencia', mensaje),
      mostrarError: (mensaje) => mostrar('error', mensaje),
    }),
    [mostrar],
  );

  return (
    <Contexto.Provider value={valor}>
      {children}

      {toasts.length > 0 ? (
        <SafeAreaView
          edges={['top']}
          pointerEvents="box-none"
          className="absolute left-0 right-0 top-0 px-4"
        >
          {toasts.map((toast) => (
            <ToastVisible key={toast.id} toast={toast} onCerrar={() => cerrar(toast.id)} />
          ))}
        </SafeAreaView>
      ) : null}
    </Contexto.Provider>
  );
}
