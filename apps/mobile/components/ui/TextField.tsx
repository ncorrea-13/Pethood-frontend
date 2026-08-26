import { TextInput } from 'react-native';
import type { TextInputProps } from 'react-native';
import { claseValor, FormField } from './FormField';
import { PALETA } from '@/constants/theme';

interface TextFieldProps extends Omit<TextInputProps, 'className'> {
  label: string;
  obligatorio?: boolean;
  error?: string;
  ayuda?: string;
}

export function TextField({
  label,
  obligatorio,
  error,
  ayuda,
  value,
  ...inputProps
}: TextFieldProps) {
  return (
    <FormField label={label} obligatorio={obligatorio} error={error} ayuda={ayuda}>
      <TextInput
        className={`${claseValor(Boolean(error), !value)} p-0`}
        placeholderTextColor={PALETA.gris[400]}
        value={value}
        {...inputProps}
      />
    </FormField>
  );
}
