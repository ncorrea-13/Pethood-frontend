import { router } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CustomButton } from '@/components/CustomButton';
import { PetHoodLogo } from '@/components/PetHoodLogo';
import { borrarToken, obtenerToken } from '@/lib/session';
import { logout } from '@/services/auth';

export default function HomeScreen() {
  const [loading, setLoading] = useState(false);

  const handleLogout = async (): Promise<void> => {
    setLoading(true);
    try {
      const token = await obtenerToken();
      if (token) {
        await logout(token).catch(() => undefined);
      }
    } finally {
      await borrarToken();
      setLoading(false);
      router.replace('/login');
    }
  };

  return (
    <View className="flex-1 bg-pethood-beige">
      <SafeAreaView className="flex-1 items-center justify-center px-6">
        <PetHoodLogo />
        <Text className="mt-8 text-center text-2xl font-bold text-gray-900">¡Listo!</Text>
        <Text className="mt-2 mb-8 text-center text-base text-gray-600">
          Ya iniciaste sesión en PetHood. El resto de la app se va a ir sumando acá.
        </Text>
        <CustomButton title="Cerrar sesión" loading={loading} onPress={handleLogout} />
      </SafeAreaView>
    </View>
  );
}
