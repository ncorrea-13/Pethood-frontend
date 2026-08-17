/**
 * Envoltorio común de los campos: etiqueta, marca de obligatorio y mensaje de error.
 * Centraliza el estilo para que todos los campos se vean igual.
 */
import { Text, View } from 'react-native';
import type { ReactNode } from 'react';

interface FormFieldProps {
  label: string;
  obligatorio?: boolean;
  error?: string;
  /** Texto de ayuda debajo del campo; el error tiene prioridad si hay uno. */
  ayuda?: string;
  children: ReactNode;
}

export function FormField({ label, obligatorio, error, ayuda, children }: FormFieldProps) {
  return (
    // Sin flex acá: el reparto de ancho lo hace FormCardColumns. Con flex-1, los campos
    // de filas de un solo elemento intentan ocupar todo el alto y se aplastan entre sí.
    <View>
      <Text className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
        {label}
        {obligatorio ? <Text className="text-pethood-orange"> *</Text> : null}
      </Text>

      {children}

      {error ? (
        <Text className="mt-1 text-xs text-red-500">{error}</Text>
      ) : ayuda ? (
        <Text className="mt-1 text-xs text-gray-400">{ayuda}</Text>
      ) : null}
    </View>
  );
}

/** Estilo del texto de un campo dentro de la tarjeta: sin borde propio, lo da la fila. */
export function claseValor(hayError: boolean, vacio: boolean): string {
  const color = hayError ? 'text-red-500' : vacio ? 'text-gray-400' : 'text-gray-800';
  return `text-base ${color}`;
}
