/** Campo de texto largo, con contador de caracteres. */
import { TextInput } from 'react-native';
import type { TextInputProps } from 'react-native';
import { claseValor, FormField } from './FormField';

interface TextAreaFieldProps extends Omit<TextInputProps, 'className' | 'multiline'> {
  label: string;
  obligatorio?: boolean;
  error?: string;
  maximo: number;
  value: string;
}

export function TextAreaField({
  label,
  obligatorio,
  error,
  maximo,
  value,
  ...inputProps
}: TextAreaFieldProps) {
  return (
    <FormField
      label={label}
      obligatorio={obligatorio}
      error={error}
      ayuda={`${value.trim().length}/${maximo}`}
    >
      <TextInput
        className={`${claseValor(Boolean(error), !value)} min-h-[72px] p-0`}
        placeholderTextColor="#9CA3AF"
        multiline
        textAlignVertical="top"
        maxLength={maximo}
        value={value}
        {...inputProps}
      />
    </FormField>
  );
}
