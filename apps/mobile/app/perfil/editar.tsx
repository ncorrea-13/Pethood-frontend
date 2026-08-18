/**
 * GUI-15 Editar Perfil — HU-1.4 y HU-1.5 (completar foto + datos).
 * Volver con cambios sin guardar pide confirmación.
 */
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation, useRouter, type Href } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CustomButton } from '@/components/CustomButton';
import { useToast } from '@/components/feedback/Toast';
import { FormCard, FormCardRow } from '@/components/ui/FormCard';
import { TextField } from '@/components/ui/TextField';
import { useSesion } from '@/hooks/useSesion';
import type { ArchivoImagenLocal } from '@/lib/formDataImagen';
import {
  sanitizarNombrePersona,
  sanitizarTelefono,
  validarEmail,
  validarNombrePersona,
  validarTelefono,
  validarUbicacion,
} from '@/lib/validacionRegistro';
import { ApiError, urlAbsoluta } from '@/services/api';
import { actualizarPerfil, obtenerPerfil } from '@/services/usuarios';

const OPCIONES_IMAGEN: ImagePicker.ImagePickerOptions = {
  mediaTypes: ['images'],
  allowsEditing: true,
  aspect: [1, 1],
  quality: 0.8,
};

interface Formulario {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  ubicacion: string;
}

interface Errores {
  nombre?: string;
  apellido?: string;
  email?: string;
  telefono?: string;
  ubicacion?: string;
}

function iniciales(nombre: string, apellido: string): string {
  return `${nombre.trim().charAt(0)}${apellido.trim().charAt(0)}`.toUpperCase() || '?';
}

function vacio(): Formulario {
  return { nombre: '', apellido: '', email: '', telefono: '', ubicacion: '' };
}

export default function EditarPerfilScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const toast = useToast();
  const { token, actualizarUsuario } = useSesion();

  const [form, setForm] = useState<Formulario>(vacio);
  const [inicial, setInicial] = useState<Formulario>(vacio);
  const [fotoUrl, setFotoUrl] = useState<string | null>(null);
  const [fotoNueva, setFotoNueva] = useState<ArchivoImagenLocal | undefined>();
  const [errors, setErrors] = useState<Errores>({});
  const [formError, setFormError] = useState<string | undefined>();
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const permitirSalir = useRef(false);

  const hayCambios =
    JSON.stringify(form) !== JSON.stringify(inicial) || Boolean(fotoNueva);

  useEffect(() => {
    if (!token) return;
    void obtenerPerfil(token)
      .then((respuesta) => {
        const siguiente: Formulario = {
          nombre: respuesta.usuario.nombre,
          apellido: respuesta.usuario.apellido,
          email: respuesta.usuario.email,
          telefono: respuesta.usuario.telefono ?? '',
          ubicacion: respuesta.usuario.ubicacion ?? '',
        };
        setForm(siguiente);
        setInicial(siguiente);
        setFotoUrl(urlAbsoluta(respuesta.usuario.imagenUrl));
      })
      .catch((error) => {
        const mensaje =
          error instanceof ApiError
            ? error.mensaje
            : 'No pudimos cargar tu perfil. Revisá tu conexión.';
        toast.mostrarError(mensaje);
      })
      .finally(() => setCargando(false));
  }, [token, toast]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (evento) => {
      if (permitirSalir.current || !hayCambios) return;

      evento.preventDefault();
      Alert.alert(
        'Descartar cambios',
        'Tenés cambios sin guardar. ¿Querés salir igual?',
        [
          { text: 'Seguir editando', style: 'cancel' },
          {
            text: 'Descartar',
            style: 'destructive',
            onPress: () => {
              permitirSalir.current = true;
              navigation.dispatch(evento.data.action);
            },
          },
        ],
      );
    });

    return unsubscribe;
  }, [hayCambios, navigation]);

  const setCampo = useCallback((campo: keyof Formulario, valor: string) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  }, []);

  const setFieldError = (campo: keyof Errores, mensaje?: string): void => {
    setErrors((prev) => {
      if (prev[campo] === mensaje) return prev;
      return { ...prev, [campo]: mensaje };
    });
  };

  const handleNombreChange = (value: string): void => {
    const formateado = sanitizarNombrePersona(value);
    setCampo('nombre', formateado);
    setFieldError('nombre', formateado.trim() ? validarNombrePersona(formateado, 'nombre') : undefined);
  };

  const handleApellidoChange = (value: string): void => {
    const formateado = sanitizarNombrePersona(value);
    setCampo('apellido', formateado);
    setFieldError(
      'apellido',
      formateado.trim() ? validarNombrePersona(formateado, 'apellido') : undefined,
    );
  };

  const handleEmailChange = (value: string): void => {
    setCampo('email', value);
    setFieldError('email', value.trim() ? validarEmail(value) : undefined);
  };

  const handleTelefonoChange = (value: string): void => {
    const formateado = sanitizarTelefono(value);
    setCampo('telefono', formateado);
    setFieldError('telefono', formateado ? validarTelefono(formateado) : undefined);
  };

  const handleUbicacionChange = (value: string): void => {
    setCampo('ubicacion', value);
    setFieldError('ubicacion', value.trim() ? validarUbicacion(value) : undefined);
  };

  const aplicarAsset = (asset: ImagePicker.ImagePickerAsset): void => {
    setFotoNueva({
      uri: asset.uri,
      mimeType: asset.mimeType,
      fileName: asset.fileName,
    });
  };

  const elegirDeGaleria = async (): Promise<void> => {
    const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permiso.granted) {
      Alert.alert('Necesitamos tus fotos', 'Dale permiso a PetHood para elegir una imagen.');
      return;
    }
    const resultado = await ImagePicker.launchImageLibraryAsync(OPCIONES_IMAGEN);
    if (!resultado.canceled && resultado.assets[0]) aplicarAsset(resultado.assets[0]);
  };

  const tomarFoto = async (): Promise<void> => {
    const permiso = await ImagePicker.requestCameraPermissionsAsync();
    if (!permiso.granted) {
      Alert.alert('Necesitamos la cámara', 'Dale permiso a PetHood para sacar una foto.');
      return;
    }
    const resultado = await ImagePicker.launchCameraAsync(OPCIONES_IMAGEN);
    if (!resultado.canceled && resultado.assets[0]) aplicarAsset(resultado.assets[0]);
  };

  const abrirSelectorFoto = (): void => {
    Alert.alert('Foto de perfil', '¿De dónde querés tomarla?', [
      { text: 'Cámara', onPress: () => void tomarFoto() },
      { text: 'Galería', onPress: () => void elegirDeGaleria() },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  };

  const validar = (): boolean => {
    const next: Errores = {
      nombre: validarNombrePersona(form.nombre, 'nombre'),
      apellido: validarNombrePersona(form.apellido, 'apellido'),
      email: validarEmail(form.email),
      telefono: validarTelefono(form.telefono),
      ubicacion: validarUbicacion(form.ubicacion),
    };
    setErrors(next);
    return !Object.values(next).some(Boolean);
  };

  const guardar = async (): Promise<void> => {
    if (!validar() || !token) return;

    setGuardando(true);
    setFormError(undefined);
    try {
      const respuesta = await actualizarPerfil(
        token,
        {
          nombre: form.nombre.trim(),
          apellido: form.apellido.trim(),
          email: form.email.trim(),
          telefono: form.telefono.trim(),
          ubicacion: form.ubicacion.trim(),
        },
        fotoNueva,
      );
      await actualizarUsuario(respuesta.usuario);
      permitirSalir.current = true;
      toast.mostrarExito('Tus datos se guardaron con éxito');
      router.back();
    } catch (error) {
      const mensaje =
        error instanceof ApiError
          ? error.mensaje
          : 'No pudimos guardar los cambios. Revisá tu conexión e intentalo de nuevo.';
      setFormError(mensaje);
    } finally {
      setGuardando(false);
    }
  };

  const fotoVisible = fotoNueva?.uri ?? fotoUrl;

  return (
    <View className="flex-1 bg-pethood-beige">
      <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
        <View className="flex-row items-center px-5 pb-2 pt-2">
          <Pressable
            onPress={() => router.back()}
            className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-white"
            accessibilityRole="button"
            accessibilityLabel="Volver"
          >
            <Ionicons name="arrow-back" size={22} color="#374151" />
          </Pressable>
          <Text className="text-2xl font-bold text-pethood-orange">Editar Perfil</Text>
        </View>

        {cargando ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator color="#FF9D5C" />
          </View>
        ) : (
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1"
          >
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerClassName="px-5 pb-8 pt-4"
            >
              <View className="mb-6 items-center">
                <Pressable
                  onPress={abrirSelectorFoto}
                  accessibilityRole="button"
                  accessibilityLabel="Cambiar foto de perfil"
                  className="relative"
                >
                  {fotoVisible ? (
                    <Image source={{ uri: fotoVisible }} className="h-28 w-28 rounded-full" />
                  ) : (
                    <View className="h-28 w-28 items-center justify-center rounded-full bg-pethood-orange">
                      <Text className="text-3xl font-bold text-white">
                        {iniciales(form.nombre, form.apellido)}
                      </Text>
                    </View>
                  )}
                  <View className="absolute bottom-0 right-0 h-9 w-9 items-center justify-center rounded-full bg-pethood-orange">
                    <Ionicons name="camera" size={16} color="#FFFFFF" />
                  </View>
                </Pressable>
              </View>

              <FormCard>
                <FormCardRow>
                  <TextField
                    label="Nombre"
                    obligatorio
                    value={form.nombre}
                    onChangeText={handleNombreChange}
                    onBlur={() =>
                      setFieldError('nombre', validarNombrePersona(form.nombre, 'nombre'))
                    }
                    error={errors.nombre}
                    autoCapitalize="words"
                    autoCorrect={false}
                    autoComplete="given-name"
                    textContentType="givenName"
                    maxLength={50}
                  />
                </FormCardRow>
                <FormCardRow>
                  <TextField
                    label="Apellido"
                    obligatorio
                    value={form.apellido}
                    onChangeText={handleApellidoChange}
                    onBlur={() =>
                      setFieldError('apellido', validarNombrePersona(form.apellido, 'apellido'))
                    }
                    error={errors.apellido}
                    autoCapitalize="words"
                    autoCorrect={false}
                    autoComplete="family-name"
                    textContentType="familyName"
                    maxLength={50}
                  />
                </FormCardRow>
                <FormCardRow>
                  <TextField
                    label="Correo"
                    obligatorio
                    value={form.email}
                    onChangeText={handleEmailChange}
                    onBlur={() => setFieldError('email', validarEmail(form.email))}
                    error={errors.email}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    textContentType="emailAddress"
                  />
                </FormCardRow>
                <FormCardRow>
                  <TextField
                    label="Teléfono"
                    obligatorio
                    value={form.telefono}
                    onChangeText={handleTelefonoChange}
                    onBlur={() => setFieldError('telefono', validarTelefono(form.telefono))}
                    error={errors.telefono}
                    keyboardType="phone-pad"
                    autoComplete="tel"
                    textContentType="telephoneNumber"
                    maxLength={16}
                  />
                </FormCardRow>
                <FormCardRow ultima>
                  <TextField
                    label="Barrio / ciudad"
                    obligatorio
                    value={form.ubicacion}
                    onChangeText={handleUbicacionChange}
                    onBlur={() => setFieldError('ubicacion', validarUbicacion(form.ubicacion))}
                    error={errors.ubicacion}
                    autoCapitalize="words"
                    maxLength={80}
                  />
                </FormCardRow>
              </FormCard>

              <Pressable
                onPress={() => router.push('/perfil/password' as Href)}
                className="mt-5 items-center"
              >
                <Text className="text-sm font-semibold text-pethood-orange">
                  Cambiar contraseña
                </Text>
              </Pressable>

              {formError ? (
                <Text className="mt-3 text-center text-sm text-red-500">{formError}</Text>
              ) : null}

              <View className="mt-6">
                <CustomButton
                  title="Guardar cambios"
                  loading={guardando}
                  onPress={() => void guardar()}
                />
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        )}
      </SafeAreaView>
    </View>
  );
}
