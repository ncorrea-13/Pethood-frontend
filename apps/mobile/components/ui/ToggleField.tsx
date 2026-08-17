/** Interruptor para un sí/no, con la etiqueta a la izquierda. */
import { Switch, Text, View } from 'react-native';

interface ToggleFieldProps {
  label: string;
  valor: boolean;
  onChange: (valor: boolean) => void;
}

export function ToggleField({ label, valor, onChange }: ToggleFieldProps) {
  return (
    <View className="flex-row items-center justify-between">
      <Text className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
        {label}
      </Text>

      <Switch
        value={valor}
        onValueChange={onChange}
        accessibilityLabel={label}
        trackColor={{ false: '#E5E7EB', true: '#FF9D5C' }}
        thumbColor="#FFFFFF"
        ios_backgroundColor="#E5E7EB"
      />
    </View>
  );
}
