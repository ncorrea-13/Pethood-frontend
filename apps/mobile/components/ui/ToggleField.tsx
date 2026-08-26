/** Interruptor para un sí/no, con la etiqueta a la izquierda. */
import { Switch, Text, View } from 'react-native';

import { PALETA } from '@/constants/theme';

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
        trackColor={{ false: PALETA.gris[200], true: PALETA.pethood.naranja }}
        thumbColor={PALETA.blanco}
        ios_backgroundColor={PALETA.gris[200]}
      />
    </View>
  );
}
