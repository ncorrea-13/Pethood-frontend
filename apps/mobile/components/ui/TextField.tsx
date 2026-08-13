import { TextInput } from 'react-native';
import type { TextInputProps } from 'react-native';
import { claseCaja, FormField } from './FormField';

interface TextFieldProps extends Omit<TextInputProps, 'className'> {
  label: string;
  obligatorio?: boolean;
  error?: string;
  ayuda?: string;
}

export function TextField({ label, obligatorio, error, ayuda, ...inputProps }: TextFieldProps) {
  return (
    <FormField label={label} obligatorio={obligatorio} error={error} ayuda={ayuda}>
      <TextInput
        className={`${claseCaja(Boolean(error))} text-base text-gray-800`}
        placeholderTextColor="#9CA3AF"
        {...inputProps}
      />
    </FormField>
  );
}
