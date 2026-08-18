/**
 * Campo de fecha con calendario nativo. `maximumDate` bloquea las fechas futuras desde el
 * propio calendario, para que ni siquiera se puedan elegir.
 */
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Platform, Pressable, Text } from 'react-native';
import { aFechaVisible, edadEnTexto } from '../../shared/validation/dates';
import { LIMITES } from '../../shared/validation/limits';
import { claseValor, FormField } from './FormField';

interface DateFieldProps {
  label: string;
  placeholder: string;
  valor: Date | null;
  onChange: (fecha: Date) => void;
  obligatorio?: boolean;
  error?: string;
  /** Se avisa al cerrar el calendario: equivale a perder el foco de un input. */
  onBlur?: () => void;
}

export function DateField({
  label,
  placeholder,
  valor,
  onChange,
  obligatorio,
  error,
  onBlur,
}: DateFieldProps) {
  const [abierto, setAbierto] = useState(false);

  const cerrar = (): void => {
    setAbierto(false);
    onBlur?.();
  };

  return (
    <FormField
      label={label}
      obligatorio={obligatorio}
      error={error}
      // El diseño muestra la edad; se calcula de la fecha en vez de pedirla aparte.
      ayuda={valor ? edadEnTexto(valor) : undefined}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${label}. ${valor ? aFechaVisible(valor) : 'sin elegir'}`}
        onPress={() => setAbierto(true)}
        className="flex-row items-center"
      >
        <Text className={`flex-1 ${claseValor(Boolean(error), !valor)}`}>
          {valor ? aFechaVisible(valor) : placeholder}
        </Text>
        <Ionicons name="calendar-outline" size={18} color="#9CA3AF" />
      </Pressable>

      {/* En Android es un diálogo y no ocupa lugar; en iOS se muestra embebido y necesita
          su propio botón para cerrarse. */}
      {abierto ? (
        <>
          <DateTimePicker
            value={valor ?? new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            maximumDate={new Date()}
            minimumDate={new Date(LIMITES.fecha.anioMinimo, 0, 1)}
            onValueChange={(_evento, fecha) => {
              if (Platform.OS === 'android') cerrar();
              if (fecha) onChange(fecha);
            }}
            onDismiss={cerrar}
          />

          {Platform.OS === 'ios' ? (
            <Pressable accessibilityRole="button" onPress={cerrar} className="items-center py-2">
              <Text className="text-base font-semibold text-pethood-orange">Listo</Text>
            </Pressable>
          ) : null}
        </>
      ) : null}
    </FormField>
  );
}
