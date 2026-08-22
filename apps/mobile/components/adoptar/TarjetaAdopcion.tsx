/**
 * Tarjeta de una mascota en el mazo de adopción.
 *
 * Es solo presentación: no sabe de gestos ni de decisiones. La foto ocupa casi todo el
 * contenedor y el texto va sobre un gradiente oscuro para que se lea encima de cualquier
 * imagen.
 */
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Image, Text, View } from 'react-native';

import { Chip } from '@/components/ui/Chip';
import { resumenMascota } from '@/constants/Mascotas';
import { urlAbsoluta } from '@/services/api';
import type { PublicacionFeed } from '@/services/publicaciones';

/** Cuántos chips de personalidad entran sin desbordar el ancho de la tarjeta. */
const MAXIMO_CHIPS = 3;

interface TarjetaAdopcionProps {
  publicacion: PublicacionFeed;
}

export function TarjetaAdopcion({ publicacion }: TarjetaAdopcionProps) {
  const { mascota } = publicacion;
  const [fotoFallo, setFotoFallo] = useState(false);

  const foto = urlAbsoluta(publicacion.imagenes[0] ?? mascota.imagenUrl);
  const chips = publicacion.personalidad.slice(0, MAXIMO_CHIPS);

  return (
    <View className="flex-1 overflow-hidden rounded-3xl bg-white shadow-lg">
      <View className="flex-1 bg-pethood-beige-dark">
        {foto && !fotoFallo ? (
          <Image
            source={{ uri: foto }}
            className="h-full w-full"
            resizeMode="cover"
            onError={() => setFotoFallo(true)}
          />
        ) : (
          <View className="h-full w-full items-center justify-center">
            <Ionicons name="paw" size={64} color="rgba(160, 100, 40, 0.22)" />
          </View>
        )}

        {/* Se muestra solo con más de una foto: un "1 de 1" no aporta nada. */}
        {publicacion.imagenes.length > 1 ? (
          <View className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1">
            <Text className="text-[11px] font-semibold text-gray-600">
              1 de {publicacion.imagenes.length}
            </Text>
          </View>
        ) : null}

        {/* `style` y no `className`: NativeWind solo mapea las clases en componentes de
            React Native, y LinearGradient viene de una librería. */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.58)']}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            paddingHorizontal: 16,
            paddingBottom: 16,
            paddingTop: 48,
          }}
        >
          <Text numberOfLines={1} className="text-3xl font-bold text-white">
            {mascota.nombre ?? 'Sin nombre'}
          </Text>

          <Text className="mt-1 text-sm text-white/90">{resumenMascota(mascota)}</Text>

          {chips.length > 0 ? (
            <View className="mt-2.5 flex-row flex-wrap gap-1.5">
              {chips.map((rasgo) => (
                <Chip key={rasgo} etiqueta={rasgo} variante="sobre-imagen" />
              ))}
            </View>
          ) : null}
        </LinearGradient>
      </View>
    </View>
  );
}
