/** Home autenticada — acceso visual a las secciones principales. */
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  ImageBackground,
  type ImageSourcePropType,
  Pressable,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useSesion } from '@/hooks/useSesion';

type NombreIcono = keyof typeof Ionicons.glyphMap;

interface TarjetaHome {
  titulo: string;
  cta: string;
  icono: NombreIcono;
  overlay: string;
  imagen: ImageSourcePropType;
}

const TARJETAS: TarjetaHome[] = [
  {
    titulo: '¿Viste a alguna de estas mascotas?',
    cta: 'Ver perdidos →',
    icono: 'search',
    overlay: 'rgba(176, 62, 48, 0.52)',
    imagen: {
      uri: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=900&q=80',
    },
  },
  {
    titulo: 'Solicitudes abiertas',
    cta: 'Ver todas →',
    icono: 'document-text-outline',
    overlay: 'rgba(36, 78, 130, 0.58)',
    imagen: {
      uri: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=900&q=80',
    },
  },
  {
    titulo: '¿Estás buscando una nueva mascota?',
    cta: 'Adoptar →',
    icono: 'heart-outline',
    overlay: 'rgba(166, 96, 42, 0.55)',
    imagen: {
      uri: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=900&q=80',
    },
  },
  {
    titulo: 'Ayudanos con estas causas',
    cta: 'Ver campañas →',
    icono: 'heart-circle-outline',
    overlay: 'rgba(46, 96, 58, 0.55)',
    imagen: {
      uri: 'https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?w=900&q=80',
    },
  },
];

function saludoSegunHora(): string {
  const hora = new Date().getHours();
  if (hora < 13) return 'Buenos días';
  if (hora < 20) return 'Buenas tardes';
  return 'Buenas noches';
}

function TarjetaAcceso({ tarjeta }: { tarjeta: TarjetaHome }) {
  return (
    <Pressable
      accessibilityRole="button"
      className="min-h-[118px] flex-1 overflow-hidden rounded-[28px] bg-neutral-500 active:opacity-90"
    >
      <ImageBackground
        source={tarjeta.imagen}
        className="flex-1 justify-end"
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        <View className="absolute inset-0" style={{ backgroundColor: tarjeta.overlay }} />
        <View className="absolute inset-x-0 bottom-0 h-24 bg-black/25" />

        <View className="absolute right-4 top-4 h-9 w-9 items-center justify-center rounded-full bg-white/20">
          <Ionicons name={tarjeta.icono} size={18} color="#FFFFFF" />
        </View>

        <View className="px-5 pb-4 pt-10">
          <Text className="text-[22px] font-bold leading-7 text-white">{tarjeta.titulo}</Text>
          <Text className="mt-1 text-sm font-medium text-white/90">{tarjeta.cta}</Text>
        </View>
      </ImageBackground>
    </Pressable>
  );
}

export default function InicioScreen() {
  const { usuario } = useSesion();
  const [modoRefugio, setModoRefugio] = useState(false);
  const nombre = usuario?.nombre?.trim();

  return (
    <View className="flex-1 bg-pethood-beige">
      <SafeAreaView className="flex-1" edges={['top']}>
        <View className="flex-row items-start justify-between px-5 pb-3 pt-2">
          <View className="flex-1 pr-3">
            <Text className="text-[34px] font-bold leading-10 text-pethood-orange">PetHood</Text>
            <Text className="mt-0.5 text-base text-gray-400">
              {nombre ? `${saludoSegunHora()}, ${nombre}` : saludoSegunHora()}
            </Text>
          </View>

          <View className="flex-row items-center gap-3 pt-2">
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Favoritos"
              className="h-10 w-10 items-center justify-center rounded-full bg-white active:opacity-80"
            >
              <Ionicons name="heart" size={22} color="#FF9D5C" />
            </Pressable>

            <Pressable
              accessibilityRole="switch"
              accessibilityState={{ checked: modoRefugio }}
              accessibilityLabel="Modo refugio"
              onPress={() => setModoRefugio((prev) => !prev)}
              className="flex-row items-center gap-2"
            >
              <Text className="text-sm text-gray-500">Refugio</Text>
              <View
                className={`h-7 w-12 justify-center rounded-full px-0.5 ${
                  modoRefugio ? 'bg-pethood-orange' : 'bg-gray-300'
                }`}
              >
                <View
                  className={`h-6 w-6 rounded-full bg-white shadow-sm ${
                    modoRefugio ? 'self-end' : 'self-start'
                  }`}
                />
              </View>
            </Pressable>
          </View>
        </View>

        <View className="flex-1 gap-3 px-5 pb-3">
          {TARJETAS.map((tarjeta) => (
            <TarjetaAcceso key={tarjeta.cta} tarjeta={tarjeta} />
          ))}
        </View>
      </SafeAreaView>
    </View>
  );
}
