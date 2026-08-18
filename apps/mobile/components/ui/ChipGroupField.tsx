/** Opciones visibles como pastillas, todas a la vista y de selección única. */
import { Pressable, Text, View } from 'react-native';
import { FormField } from './FormField';

export interface OpcionChip<T> {
  valor: T;
  etiqueta: string;
}

interface ChipGroupFieldProps<T> {
  label: string;
  opciones: OpcionChip<T>[];
  valor: T | null;
  onChange: (valor: T) => void;
  obligatorio?: boolean;
  error?: string;
}

export function ChipGroupField<T extends string | number>({
  label,
  opciones,
  valor,
  onChange,
  obligatorio,
  error,
}: ChipGroupFieldProps<T>) {
  return (
    <FormField label={label} obligatorio={obligatorio} error={error}>
      <View className="mt-1 flex-row flex-wrap gap-2">
        {opciones.map((opcion) => {
          const activa = opcion.valor === valor;

          return (
            <Pressable
              key={String(opcion.valor)}
              accessibilityRole="radio"
              accessibilityState={{ selected: activa }}
              onPress={() => onChange(opcion.valor)}
              className={`rounded-full border px-3.5 py-1.5 active:opacity-80 ${
                activa
                  ? 'border-pethood-orange bg-pethood-orange'
                  : error
                    ? 'border-red-300 bg-white'
                    : 'border-gray-200 bg-white'
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
