import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CustomButton } from '@/components/CustomButton';
import { CustomInput } from '@/components/CustomInput';
import { PetHoodLogo } from '@/components/PetHoodLogo';
import { useToast } from '@/components/feedback/Toast';
import { useSesion } from '@/hooks/useSesion';

export default function LoginScreen() {
  const router = useRouter();
  const toast = useToast();
  const { iniciarSesion } = useSesion();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );

  const validateForm = (): boolean => {
    const nextErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      nextErrors.email = 'El correo electrónico es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = 'Ingresa un correo electrónico válido';
    }

    if (!password) {
      nextErrors.password = 'La contraseña es obligatoria';
    } else if (password.length < 8) {
      nextErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleLogin = async (): Promise<void> => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await iniciarSesion(email.trim(), password);
      router.replace('/(tabs)');
    } catch (err) {
      toast.mostrarError(
        err instanceof Error ? err.message : 'No pudimos iniciar sesión. Revisá tu conexión.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-pethood-beige">
      <SafeAreaView className="flex-1" edges={['top']}>
        <View className="relative h-[42%] items-center justify-center">
          <View className="absolute -left-16 -top-16 h-48 w-48 rounded-full bg-pethood-orange/10" />
          <PetHoodLogo />
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          <View className="flex-1 rounded-t-3xl bg-white px-6 pb-8 pt-8">
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerClassName="flex-grow"
            >
                <Text className="mb-1 text-2xl font-bold text-gray-900">
                  ¡Hola de nuevo!
                </Text>
                <Text className="mb-8 text-base text-gray-500">
                  Inicia sesión para continuar
                </Text>

                <CustomInput
                  label="Correo electrónico"
                  placeholder="tu@correo.com"
                  value={email}
                  onChangeText={setEmail}
                  error={errors.email}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  textContentType="emailAddress"
                />

                <CustomInput
                  label="Contraseña"
                  placeholder="Mínimo 8 caracteres"
                  value={password}
                  onChangeText={setPassword}
                  error={errors.password}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoComplete="password"
                  textContentType="password"
                  rightIcon={
                    <Ionicons
                      name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={22}
                      color="#9CA3AF"
                    />
                  }
                  onRightIconPress={() => setShowPassword((prev) => !prev)}
                />

                <View className="mt-2">
                  <CustomButton
                    title="Iniciar sesión"
                    loading={loading}
                    onPress={handleLogin}
                  />
                </View>
              </ScrollView>

              <View className="mt-4 items-center">
                <Text className="text-base text-gray-600">
                  ¿No tienes cuenta?{' '}
                  <Link href="/register" asChild>
                    <Pressable>
                      <Text className="font-semibold text-pethood-orange">
                        Regístrate
                      </Text>
                    </Pressable>
                  </Link>
                </Text>
              </View>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </View>
    );
  }
