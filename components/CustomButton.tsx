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
}

export function CustomButton({
  title,
  loading = false,
  variant = 'primary',
  disabled,
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
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
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
