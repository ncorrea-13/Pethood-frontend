/** Opciones visibles como pastillas, todas a la vista y de selección única. */
import { View } from 'react-native';
import { Chip } from './Chip';
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
        {opciones.map((opcion) => (
          <Chip
            key={String(opcion.valor)}
            etiqueta={opcion.etiqueta}
            variante="seleccion"
            activa={opcion.valor === valor}
            onPress={() => onChange(opcion.valor)}
          />
        ))}
      </View>
    </FormField>
  );
}
