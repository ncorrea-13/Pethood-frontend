/**
 * Envoltorio común de los campos de formulario: label, marca de obligatorio y mensaje
 * de error. Centraliza el estilo para que todos los campos se vean igual.
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
    <View className="mb-5">
      <Text className="mb-1.5 text-sm text-gray-700">
        {label}
        {obligatorio ? <Text className="text-red-500"> *</Text> : null}
      </Text>

      {children}

      {error ? (
        <Text className="mt-1.5 text-xs text-red-500">{error}</Text>
      ) : ayuda ? (
        <Text className="mt-1.5 text-xs text-gray-400">{ayuda}</Text>
      ) : null}
    </View>
  );
}

/** Estilo compartido de las cajas de los campos, para que input y selector coincidan. */
export function claseCaja(hayError: boolean, deshabilitado = false): string {
  const borde = hayError ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-pethood-input';
  return `w-full rounded-2xl border px-4 py-3 ${deshabilitado ? 'border-gray-200 bg-gray-100' : borde}`;
}
