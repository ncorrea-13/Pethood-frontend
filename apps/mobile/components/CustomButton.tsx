import {
  ActivityIndicator,
  Pressable,
  Text,
  type PressableProps,
} from 'react-native';

export interface CustomButtonProps extends Omit<PressableProps, 'children'> {
  title: string;
  loading?: boolean;
  variant?: 'primary' | 'secondary';
  /**
   * Se llama al tocar el botón mientras está deshabilitado, para poder explicar qué falta
   * en vez de no responder. Nunca dispara `onPress`.
   */
  onPressDeshabilitado?: () => void;
}

export function CustomButton({
  title,
  loading = false,
  variant = 'primary',
  disabled,
  onPress,
  onPressDeshabilitado,
  className = '',
  ...pressableProps
}: CustomButtonProps) {
  const isDisabled = disabled || loading;

  const variantClasses =
    variant === 'primary'
      ? 'bg-pethood-orange active:opacity-90'
      : 'border border-pethood-orange bg-transparent active:opacity-80';

  const textClasses =
    variant === 'primary' ? 'text-white' : 'text-pethood-orange';

  return (
    <Pressable
      accessibilityRole="button"
      // Se anuncia como deshabilitado, pero sigue recibiendo el toque para poder explicar
      // qué falta. Mientras carga sí se bloquea, para no reenviar el formulario.
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={loading}
      onPress={isDisabled ? onPressDeshabilitado : onPress}
      className={`w-full items-center justify-center rounded-2xl py-4 ${variantClasses} ${
        isDisabled ? 'opacity-60' : ''
      } ${className}`}
      {...pressableProps}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#FFFFFF' : '#FF7A45'} />
      ) : (
        <Text className={`text-base font-semibold ${textClasses}`}>{title}</Text>
      )}
    </Pressable>
  );
}
