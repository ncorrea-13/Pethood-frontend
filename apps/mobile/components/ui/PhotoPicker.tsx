/**
 * Selección de la foto de la mascota: deja elegir entre galería y cámara, muestra la
 * miniatura y permite quitarla o reemplazarla.
 *
 * Valida peso y formato antes de aceptar el archivo, para avisar en el momento en vez de
 * esperar a que el servidor rechace el alta.
 */
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { ActivityIndicator, Alert, Image, Pressable, Text, View } from 'react-native';
import { LIMITES } from '../../shared/validation/limits';

export interface FotoElegida {
  uri: string;
  nombre: string;
  tipo: string;
}

interface PhotoPickerProps {
  foto: FotoElegida | null;
  onChange: (foto: FotoElegida | null) => void;
  error?: string;
}

const EXTENSION_POR_TIPO: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

function tipoDesdeUri(uri: string): string {
  const extension = uri.split('.').pop()?.toLowerCase();

  if (extension === 'png') return 'image/png';
  if (extension === 'webp') return 'image/webp';
  return 'image/jpeg';
}

export function PhotoPicker({ foto, onChange, error }: PhotoPickerProps) {
  const [cargando, setCargando] = useState(false);

  const procesar = (resultado: ImagePicker.ImagePickerResult): void => {
    if (resultado.canceled || !resultado.assets[0]) return;

    const asset = resultado.assets[0];
    const tipo = asset.mimeType ?? tipoDesdeUri(asset.uri);

    if (!LIMITES.imagen.formatos.includes(tipo as never)) {
      Alert.alert(
        'Formato no admitido',
        'Subí una imagen en JPG, PNG o WEBP.',
      );
      return;
    }

    if (asset.fileSize && asset.fileSize > LIMITES.imagen.tamanioMaximoBytes) {
      Alert.alert(
        'La foto es muy pesada',
        'Subí una imagen en JPG o PNG que pese menos de 5 MB.',
      );
      return;
    }

    const extension = EXTENSION_POR_TIPO[tipo] ?? 'jpg';
    onChange({ uri: asset.uri, nombre: `mascota.${extension}`, tipo });
  };

  const abrirGaleria = async (): Promise<void> => {
    setCargando(true);
    try {
      procesar(
        await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          quality: 0.8,
        }),
      );
    } finally {
      setCargando(false);
    }
  };

  const abrirCamara = async (): Promise<void> => {
    const permiso = await ImagePicker.requestCameraPermissionsAsync();

    if (!permiso.granted) {
      Alert.alert(
        'Necesitamos la cámara',
        'Dale permiso a PetHood para usar la cámara, o elegí una foto de la galería.',
      );
      return;
    }

    setCargando(true);
    try {
      procesar(await ImagePicker.launchCameraAsync({ quality: 0.8 }));
    } finally {
      setCargando(false);
    }
  };

  const elegir = (): void => {
    Alert.alert('Foto de la mascota', '¿De dónde querés sacar la foto?', [
      { text: 'Cámara', onPress: () => void abrirCamara() },
      { text: 'Galería', onPress: () => void abrirGaleria() },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  };

  return (
    <View className="mb-5">
      <Text className="mb-1.5 text-sm text-gray-700">
        Foto de la mascota<Text className="text-red-500"> *</Text>
      </Text>

      {foto ? (
        <View className="relative self-start">
          <Image
            source={{ uri: foto.uri }}
            className="h-40 w-40 rounded-2xl"
            accessibilityLabel="Vista previa de la foto elegida"
          />

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Quitar la foto"
            onPress={() => onChange(null)}
            hitSlop={8}
            className="absolute -right-2 -top-2 h-9 w-9 items-center justify-center rounded-full bg-red-500 shadow-lg active:opacity-80"
          >
            <Ionicons name="close" size={20} color="#FFFFFF" />
          </Pressable>

          <Pressable
            accessibilityRole="button"
            onPress={elegir}
            className="mt-2 items-center rounded-xl bg-gray-100 py-2 active:opacity-80"
          >
            <Text className="text-sm font-medium text-gray-700">Cambiar foto</Text>
          </Pressable>
        </View>
      ) : (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Agregar foto"
          onPress={elegir}
          disabled={cargando}
          className={`h-40 items-center justify-center rounded-2xl border-2 border-dashed ${
            error ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-pethood-input'
          }`}
        >
          {cargando ? (
            <ActivityIndicator color="#FF9D5C" />
          ) : (
            <>
              <Ionicons name="camera-outline" size={32} color="#9CA3AF" />
              <Text className="mt-2 text-base font-medium text-gray-600">Agregar foto</Text>
              <Text className="mt-0.5 text-xs text-gray-400">JPG, PNG o WEBP, hasta 5 MB</Text>
            </>
          )}
        </Pressable>
      )}

      {error ? <Text className="mt-1.5 text-xs text-red-500">{error}</Text> : null}
    </View>
  );
}
