import { Ionicons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
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

interface RegisterForm {
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  password: string;
}

interface RegisterErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  birthDate?: string;
  password?: string;
}

export default function RegisterScreen() {
  const [form, setForm] = useState<RegisterForm>({
    firstName: '',
    lastName: '',
    email: '',
    birthDate: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<RegisterErrors>({});

  const updateField = (field: keyof RegisterForm, value: string): void => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    const nextErrors: RegisterErrors = {};

    if (!form.firstName.trim()) {
      nextErrors.firstName = 'El nombre es obligatorio';
    }

    if (!form.lastName.trim()) {
      nextErrors.lastName = 'El apellido es obligatorio';
    }

    if (!form.email.trim()) {
      nextErrors.email = 'El correo electrónico es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = 'Ingresa un correo electrónico válido';
    }

    if (!form.birthDate.trim()) {
      nextErrors.birthDate = 'La fecha de nacimiento es obligatoria';
    }

    if (!form.password) {
      nextErrors.password = 'La contraseña es obligatoria';
    } else if (form.password.length < 8) {
      nextErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleRegister = async (): Promise<void> => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // TODO: Integrar con el endpoint de registro del backend
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-pethood-beige">
      <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerClassName="flex-grow px-6 pb-8 pt-4"
          >
            <View className="mb-6 flex-row items-center">
              <Pressable
                onPress={() => router.back()}
                className="mr-4 h-10 w-10 items-center justify-center rounded-full bg-white"
                accessibilityRole="button"
                accessibilityLabel="Volver"
              >
                <Ionicons name="arrow-back" size={22} color="#374151" />
              </Pressable>
              <Text className="text-2xl font-bold text-pethood-orange">
                Crear cuenta
              </Text>
            </View>

            <Text className="mb-8 text-base text-gray-600">
              Completa tus datos para unirte a PetHood
            </Text>

            <View className="flex-row gap-3">
              <View className="flex-1">
                <CustomInput
                  label="Nombre"
                  placeholder="Tu nombre"
                  value={form.firstName}
                  onChangeText={(value) => updateField('firstName', value)}
                  error={errors.firstName}
                  autoCapitalize="words"
                  autoComplete="given-name"
                  textContentType="givenName"
                />
              </View>
              <View className="flex-1">
                <CustomInput
                  label="Apellido"
                  placeholder="Tu apellido"
                  value={form.lastName}
                  onChangeText={(value) => updateField('lastName', value)}
                  error={errors.lastName}
                  autoCapitalize="words"
                  autoComplete="family-name"
                  textContentType="familyName"
                />
              </View>
            </View>

            <CustomInput
              label="Correo electrónico"
              placeholder="tu@correo.com"
              value={form.email}
              onChangeText={(value) => updateField('email', value)}
              error={errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              textContentType="emailAddress"
            />

            <CustomInput
              label="Fecha de nacimiento"
              placeholder="DD/MM/AAAA"
              value={form.birthDate}
              onChangeText={(value) => updateField('birthDate', value)}
              error={errors.birthDate}
              keyboardType="numbers-and-punctuation"
              rightIcon={
                <Ionicons name="calendar-outline" size={22} color="#9CA3AF" />
              }
            />

            <CustomInput
              label="Contraseña"
              placeholder="Mínimo 8 caracteres"
              value={form.password}
              onChangeText={(value) => updateField('password', value)}
              error={errors.password}
              secureTextEntry
              autoCapitalize="none"
              autoComplete="new-password"
              textContentType="newPassword"
            />

            <View className="mt-4">
              <CustomButton
                title="Registrarme"
                loading={loading}
                onPress={handleRegister}
              />
            </View>

            <View className="mt-6 items-center">
              <Text className="text-base text-gray-600">
                ¿Ya tienes cuenta?{' '}
                <Link href="/login" asChild>
                  <Pressable>
                    <Text className="font-semibold text-pethood-orange">
                      Inicia sesión
                    </Text>
                  </Pressable>
                </Link>
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
