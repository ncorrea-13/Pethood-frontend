/** Pastillas de selección múltiple: se marcan y desmarcan tocándolas. */
import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import { FormField } from './FormField';

interface ChipMultiFieldProps {
  label: string;
  opciones: string[];
  seleccionadas: string[];
  onChange: (seleccionadas: string[]) => void;
  /** Tope opcional de cuántas se pueden marcar a la vez. */
  maximo?: number;
  error?: string;
}

export function ChipMultiField({
  label,
  opciones,
  seleccionadas,
  onChange,
  maximo,
  error,
}: ChipMultiFieldProps) {
  const alternar = (opcion: string): void => {
    if (seleccionadas.includes(opcion)) {
      onChange(seleccionadas.filter((actual) => actual !== opcion));
      return;
    }

    if (maximo && seleccionadas.length >= maximo) return;
    onChange([...seleccionadas, opcion]);
  };

  const ayuda = maximo ? `${seleccionadas.length} de ${maximo}` : undefined;

  return (
    <FormField label={label} error={error} ayuda={ayuda}>
      <View className="mt-1 flex-row flex-wrap gap-2">
        {opciones.map((opcion) => {
          const activa = seleccionadas.includes(opcion);
          const bloqueada = !activa && Boolean(maximo) && seleccionadas.length >= maximo!;

          return (
            <Pressable
              key={opcion}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: activa, disabled: bloqueada }}
              onPress={() => alternar(opcion)}
              className={`flex-row items-center gap-1 rounded-full border px-3 py-1.5 active:opacity-80 ${
                activa
                  ? 'border-pethood-orange bg-pethood-orange/10'
                  : `border-gray-200 bg-white ${bloqueada ? 'opacity-40' : ''}`
              }`}
            >
              {activa ? <Ionicons name="checkmark" size={13} color="#E0742E" /> : null}
              <Text
                className={`text-sm ${activa ? 'font-semibold text-pethood-orange-dark' : 'text-gray-600'}`}
              >
                {opcion}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </FormField>
  );
}
