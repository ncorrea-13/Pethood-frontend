/** Elección entre pocas opciones excluyentes, mostradas como un control segmentado. */
import { Pressable, Text, View } from 'react-native';
import { FormField } from './FormField';

export interface OpcionSegmento<T> {
  valor: T;
  etiqueta: string;
}

interface SegmentedFieldProps<T> {
  label: string;
  opciones: OpcionSegmento<T>[];
  valor: T | null;
  onChange: (valor: T) => void;
  obligatorio?: boolean;
  error?: string;
}

export function SegmentedField<T extends string | number>({
  label,
  opciones,
  valor,
  onChange,
  obligatorio,
  error,
}: SegmentedFieldProps<T>) {
  return (
    <FormField label={label} obligatorio={obligatorio} error={error}>
      <View
        className={`mt-1 flex-row rounded-2xl border p-1 ${
          error ? 'border-red-300 bg-red-50' : 'border-gray-100 bg-gray-50'
        }`}
      >
        {opciones.map((opcion) => {
          const activa = opcion.valor === valor;

          return (
            <Pressable
              key={String(opcion.valor)}
              accessibilityRole="radio"
              accessibilityState={{ selected: activa }}
              onPress={() => onChange(opcion.valor)}
              className={`flex-1 items-center rounded-xl py-2.5 active:opacity-80 ${
                activa ? 'bg-pethood-orange' : ''
              }`}
            >
              <Text
                className={`text-sm ${activa ? 'font-semibold text-white' : 'text-gray-600'}`}
              >
                {opcion.etiqueta}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </FormField>
  );
}
