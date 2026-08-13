/**
 * Campo de fecha con calendario nativo. `maximumDate` bloquea las fechas futuras desde el
 * propio calendario, para que ni siquiera se puedan elegir.
 */
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import { aFechaVisible } from '../../shared/validation/dates';
import { LIMITES } from '../../shared/validation/limits';
import { claseCaja, FormField } from './FormField';

interface DateFieldProps {
  label: string;
  placeholder: string;
  valor: Date | null;
  onChange: (fecha: Date) => void;
  obligatorio?: boolean;
  error?: string;
}

export function DateField({
  label,
  placeholder,
  valor,
  onChange,
  obligatorio,
  error,
}: DateFieldProps) {
  const [abierto, setAbierto] = useState(false);

  return (
    <FormField label={label} obligatorio={obligatorio} error={error}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${label}. ${valor ? aFechaVisible(valor) : 'sin elegir'}`}
        onPress={() => setAbierto(true)}
        className={`${claseCaja(Boolean(error))} flex-row items-center`}
      >
        <Text className={`flex-1 text-base ${valor ? 'text-gray-800' : 'text-gray-400'}`}>
          {valor ? aFechaVisible(valor) : placeholder}
        </Text>
        <Ionicons name="calendar-outline" size={20} color="#9CA3AF" />
      </Pressable>

      {abierto ? (
        <View>
          <DateTimePicker
            value={valor ?? new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            maximumDate={new Date()}
            minimumDate={new Date(LIMITES.fecha.anioMinimo, 0, 1)}
            onChange={(evento, fecha) => {
              // En Android el calendario se cierra solo; en iOS queda abierto.
              if (Platform.OS === 'android') setAbierto(false);
              if (evento.type === 'set' && fecha) onChange(fecha);
            }}
          />

          {Platform.OS === 'ios' ? (
            <Pressable
              accessibilityRole="button"
              onPress={() => setAbierto(false)}
              className="items-center py-2"
            >
              <Text className="text-base font-semibold text-pethood-orange">Listo</Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}
    </FormField>
  );
}
