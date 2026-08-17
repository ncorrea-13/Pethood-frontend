/**
 * GUI-24 Nueva publicación de adopción.
 *
 * Se llega acá con la mascota ya creada: esta pantalla solo suma los datos propios de la
 * publicación. La validación es para UX; la fuente de verdad es el backend.
 */
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CustomButton } from '@/components/CustomButton';
import { useToast } from '@/components/feedback/Toast';
import { FormCard, FormCardRow } from '@/components/ui/FormCard';
import { TagInputField } from '@/components/ui/TagInputField';
import { TextAreaField } from '@/components/ui/TextAreaField';
import { TextField } from '@/components/ui/TextField';
import { crearPublicacion } from '@/services/mascotas';
import { LIMITES } from '@/shared/validation/limits';
import { validarTexto } from '@/shared/validation/text';

interface ErroresFormulario {
  descripcion?: string;
  ubicacion?: string;
}

const ETIQUETAS: Record<keyof ErroresFormulario, string> = {
  descripcion: 'la descripción',
  ubicacion: 'la ubicación',
};

export default function CrearPublicacionScreen() {
  const router = useRouter();
  const toast = useToast();
  const { mascotaId } = useLocalSearchParams<{ mascotaId?: string }>();

  const [descripcion, setDescripcion] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [requisitos, setRequisitos] = useState<string[]>([]);

  const [publicando, setPublicando] = useState(false);
  const [mostrarErrores, setMostrarErrores] = useState(false);
  const [tocados, setTocados] = useState<Partial<Record<keyof ErroresFormulario, boolean>>>({});

  const errores = useMemo<ErroresFormulario>(() => {
    const resultado: ErroresFormulario = {};

    const errorDescripcion = validarTexto(descripcion, {
      min: 1,
      max: LIMITES.publicacion.descripcion.max,
      etiqueta: 'La descripción',
    });
    if (errorDescripcion) resultado.descripcion = errorDescripcion;

    const errorUbicacion = validarTexto(ubicacion, {
      min: 1,
      max: LIMITES.publicacion.ubicacion.max,
      etiqueta: 'La ubicación',
    });
    if (errorUbicacion) resultado.ubicacion = errorUbicacion;

    return resultado;
  }, [descripcion, ubicacion]);

  const formularioValido = Object.keys(errores).length === 0 && Boolean(mascotaId);

  const errorDe = (campo: keyof ErroresFormulario): string | undefined =>
    mostrarErrores || tocados[campo] ? errores[campo] : undefined;

  const marcarTocado = (campo: keyof ErroresFormulario): void =>
    setTocados((previos) => ({ ...previos, [campo]: true }));

  const explicarQueFalta = (): void => {
    setMostrarErrores(true);

    const faltantes = (Object.keys(errores) as (keyof ErroresFormulario)[]).map(
      (campo) => ETIQUETAS[campo],
    );

    if (faltantes.length === 0) return;

    const lista = faltantes.length === 1 ? faltantes[0] : faltantes.join(' y ');
    toast.mostrarAdvertencia(`Todavía falta completar ${lista}.`);
  };

  const publicar = async (): Promise<void> => {
    setMostrarErrores(true);
    if (!formularioValido) return;

    setPublicando(true);
    try {
      await crearPublicacion({
        mascotaId: Number(mascotaId),
        descripcion: descripcion.trim(),
        ubicacion: ubicacion.trim(),
        requisitos,
      });

      toast.mostrarExito('¡Listo! Tu publicación ya está activa.');
      router.replace('/(tabs)');
    } catch (err) {
      toast.mostrarError(
        err instanceof Error ? err.message : 'No pudimos publicar. Intentalo de nuevo.',
      );
    } finally {
      setPublicando(false);
    }
  };

  return (
    <View className="flex-1 bg-pethood-beige">
      <SafeAreaView className="flex-1" edges={['top']}>
        <View className="flex-row items-center gap-3 px-4 py-3">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Volver"
            onPress={() => router.replace('/(tabs)')}
            hitSlop={8}
            className="h-10 w-10 items-center justify-center rounded-full bg-white active:opacity-80"
          >
            <Ionicons name="chevron-back" size={20} color="#4B5563" />
          </Pressable>

          <Text className="text-2xl font-bold text-pethood-orange">Nueva Publicación</Text>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          className="flex-1"
        >
          <ScrollView
            className="flex-1"
            contentContainerClassName="px-4 pb-10"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View className="mb-4 flex-row items-center gap-2 rounded-2xl bg-pethood-orange/10 px-4 py-3">
              <Ionicons name="megaphone-outline" size={18} color="#FF9D5C" />
              <Text className="flex-1 text-sm text-gray-600">
                Tu mascota ya está creada. Contá cómo es para que la encuentren.
              </Text>
            </View>

            <FormCard>
              <FormCardRow>
                <TextAreaField
                  label="Descripción para la publicación"
                  obligatorio
                  placeholder="Ej. Cariñoso, ideal para familias con patio"
                  value={descripcion}
                  onChangeText={setDescripcion}
                  onBlur={() => marcarTocado('descripcion')}
                  maximo={LIMITES.publicacion.descripcion.max}
                  error={errorDe('descripcion')}
                />
              </FormCardRow>

              <FormCardRow>
                <TagInputField
                  label="Requisitos del adoptante"
                  placeholder="Presioná Enter para agregar"
                  etiquetas={requisitos}
                  onChange={setRequisitos}
                  maximoPorEtiqueta={LIMITES.publicacion.requisito.max}
                />
              </FormCardRow>

              <FormCardRow ultima>
                <TextField
                  label="Ubicación"
                  obligatorio
                  placeholder="Ej. Godoy Cruz, Mendoza"
                  value={ubicacion}
                  onChangeText={setUbicacion}
                  onBlur={() => marcarTocado('ubicacion')}
                  maxLength={LIMITES.publicacion.ubicacion.max}
                  error={errorDe('ubicacion')}
                />
              </FormCardRow>
            </FormCard>

            <View className="mt-5">
              <CustomButton
                title="Publicar en adopción"
                loading={publicando}
                disabled={!formularioValido}
                onPress={() => void publicar()}
                onPressDeshabilitado={explicarQueFalta}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
