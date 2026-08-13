/**
 * GUI-16 Crear Mascota Adoptante / GUI-30 Crear Mascota Refugio.
 *
 * Una sola pantalla para los dos actores: comparten todos los campos base y difieren solo
 * en un campo. El adoptante elige si la mascota es propia o para adopción; el refugio
 * elige el estado con el que la mascota entra al sistema.
 *
 * La validación de acá es solo para UX: la fuente de verdad es el backend.
 */
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
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
import { DateField } from '@/components/ui/DateField';
import { PhotoPicker, type FotoElegida } from '@/components/ui/PhotoPicker';
import { SelectField, type OpcionSelect } from '@/components/ui/SelectField';
import { TextField } from '@/components/ui/TextField';
import { useSesion } from '@/hooks/useSesion';
import {
  listarEspecies,
  listarEstadosMascota,
  listarRazas,
  type EstadoMascota,
  type OpcionCatalogo,
} from '@/services/catalogos';
import { crearMascota, type Destino, type Genero, type Tamanio } from '@/services/mascotas';
import { aFechaISO, validarFechaPasada } from '@/shared/validation/dates';
import { LIMITES } from '@/shared/validation/limits';
import { filtrarEntradaDecimal, validarDecimal } from '@/shared/validation/numbers';
import { validarTexto } from '@/shared/validation/text';

const OPCIONES_GENERO: OpcionSelect<Genero>[] = [
  { valor: 'MACHO', etiqueta: 'Macho' },
  { valor: 'HEMBRA', etiqueta: 'Hembra' },
];

const OPCIONES_TAMANIO: OpcionSelect<Tamanio>[] = [
  { valor: 'PEQUENO', etiqueta: 'Pequeño' },
  { valor: 'MEDIANO', etiqueta: 'Mediano' },
  { valor: 'GRANDE', etiqueta: 'Grande' },
];

const OPCIONES_DESTINO: OpcionSelect<Destino>[] = [
  { valor: 'PROPIA', etiqueta: 'Es mi mascota' },
  { valor: 'ADOPCION', etiqueta: 'Es para adopción' },
];

interface ErroresFormulario {
  foto?: string;
  nombre?: string;
  fechaNacimiento?: string;
  genero?: string;
  peso?: string;
  tamanio?: string;
  especieId?: string;
  razaId?: string;
  destino?: string;
  estadoMascotaId?: string;
}

export default function CrearMascotaScreen() {
  const router = useRouter();
  const toast = useToast();
  const { esRefugio } = useSesion();

  const [foto, setFoto] = useState<FotoElegida | null>(null);
  const [nombre, setNombre] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState<Date | null>(null);
  const [genero, setGenero] = useState<Genero | null>(null);
  const [peso, setPeso] = useState('');
  const [tamanio, setTamanio] = useState<Tamanio | null>(null);
  const [especieId, setEspecieId] = useState<number | null>(null);
  const [razaId, setRazaId] = useState<number | null>(null);
  const [destino, setDestino] = useState<Destino | null>(null);
  const [estadoMascotaId, setEstadoMascotaId] = useState<number | null>(null);

  const [especies, setEspecies] = useState<OpcionCatalogo[]>([]);
  const [razas, setRazas] = useState<OpcionCatalogo[]>([]);
  const [estados, setEstados] = useState<EstadoMascota[]>([]);

  const [cargandoCatalogos, setCargandoCatalogos] = useState(true);
  const [cargandoRazas, setCargandoRazas] = useState(false);
  const [guardando, setGuardando] = useState(false);
  /** Los errores recién se muestran cuando se intenta guardar, no mientras se completa. */
  const [mostrarErrores, setMostrarErrores] = useState(false);

  useEffect(() => {
    const cargar = async (): Promise<void> => {
      try {
        const [especiesCargadas, estadosCargados] = await Promise.all([
          listarEspecies(),
          esRefugio ? listarEstadosMascota() : Promise.resolve([]),
        ]);

        setEspecies(especiesCargadas);
        setEstados(estadosCargados.filter((estado) => estado.seleccionableEnAlta));
      } catch {
        toast.mostrarError('No pudimos cargar las especies. Revisá tu conexión.');
      } finally {
        setCargandoCatalogos(false);
      }
    };

    void cargar();
  }, [esRefugio, toast]);

  // La raza depende de la especie: al cambiarla se recarga el listado y se limpia la elegida.
  useEffect(() => {
    if (especieId === null) {
      setRazas([]);
      return;
    }

    const cargar = async (): Promise<void> => {
      setCargandoRazas(true);
      try {
        setRazas(await listarRazas(especieId));
      } catch {
        toast.mostrarError('No pudimos cargar las razas de esa especie.');
      } finally {
        setCargandoRazas(false);
      }
    };

    void cargar();
  }, [especieId, toast]);

  const errores = useMemo<ErroresFormulario>(() => {
    const resultado: ErroresFormulario = {};

    if (!foto) resultado.foto = 'Debe agregar al menos una foto de la mascota';

    const errorNombre = validarTexto(nombre, {
      ...LIMITES.mascota.nombre,
      etiqueta: 'El nombre',
    });
    if (errorNombre) resultado.nombre = errorNombre;

    const errorFecha = validarFechaPasada(fechaNacimiento, 'La fecha de nacimiento');
    if (errorFecha) resultado.fechaNacimiento = errorFecha;

    if (!genero) resultado.genero = 'El sexo es obligatorio';

    const errorPeso = validarDecimal(peso, { ...LIMITES.mascota.peso, etiqueta: 'El peso' });
    if (errorPeso) resultado.peso = errorPeso;

    if (!tamanio) resultado.tamanio = 'El tamaño es obligatorio';
    if (especieId === null) resultado.especieId = 'La especie es obligatoria';
    if (razaId === null) resultado.razaId = 'La raza es obligatoria';

    if (esRefugio) {
      if (estadoMascotaId === null) resultado.estadoMascotaId = 'El estado es obligatorio';
    } else if (!destino) {
      resultado.destino = 'Indicá si es tu mascota o si es para adopción';
    }

    return resultado;
  }, [
    foto,
    nombre,
    fechaNacimiento,
    genero,
    peso,
    tamanio,
    especieId,
    razaId,
    esRefugio,
    estadoMascotaId,
    destino,
  ]);

  const formularioValido = Object.keys(errores).length === 0;

  const erroresVisibles = mostrarErrores ? errores : {};

  /**
   * Si con lo elegido se puede ofrecer la mascota en adopción. El refugio lo decide por el
   * estado (el catálogo trae la bandera, así la regla no se duplica acá) y el adoptante
   * por el selector de destino.
   */
  const permitePublicar = esRefugio
    ? (estados.find((estado) => estado.id === estadoMascotaId)?.habilitaPublicacion ?? false)
    : destino === 'ADOPCION';

  const guardar = async (continuarAPublicacion: boolean): Promise<void> => {
    setMostrarErrores(true);
    if (!formularioValido || !foto || !fechaNacimiento) return;

    setGuardando(true);
    try {
      const mascota = await crearMascota({
        nombre: nombre.trim(),
        fechaNacimiento: aFechaISO(fechaNacimiento),
        genero: genero!,
        peso,
        tamanio: tamanio!,
        especieId: especieId!,
        razaId: razaId!,
        destino: esRefugio ? undefined : destino!,
        estadoMascotaId: esRefugio ? estadoMascotaId! : undefined,
        foto,
      });

      toast.mostrarExito(`¡Listo! ${mascota.nombre} ya está en tus mascotas.`);

      if (continuarAPublicacion && mascota.habilitaPublicacion) {
        router.replace({ pathname: '/publicaciones/crear', params: { mascotaId: mascota.id } });
      } else {
        router.replace('/(tabs)');
      }
    } catch (err) {
      // Se queda en la pantalla con todo lo cargado, para poder reintentar.
      toast.mostrarError(
        err instanceof Error ? err.message : 'No pudimos crear la mascota. Intentalo de nuevo.',
      );
    } finally {
      setGuardando(false);
    }
  };

  return (
    <View className="flex-1 bg-pethood-beige">
      <SafeAreaView className="flex-1" edges={['top']}>
        <View className="flex-row items-center gap-3 border-b border-gray-200 bg-white px-4 py-4">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Volver"
            onPress={() => router.back()}
            hitSlop={8}
            className="rounded-full p-2 active:bg-gray-100"
          >
            <Ionicons name="chevron-back" size={22} color="#4B5563" />
          </Pressable>

          <View>
            <Text className="text-xl font-bold text-gray-900">Crear mascota</Text>
            <Text className="text-sm text-gray-600">
              {esRefugio ? 'Cargala en el refugio' : 'Contanos de tu mascota'}
            </Text>
          </View>
        </View>

        {cargandoCatalogos ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#FF9D5C" />
          </View>
        ) : (
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            className="flex-1"
          >
            <ScrollView
              className="flex-1"
              contentContainerClassName="px-5 py-6 pb-10"
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <PhotoPicker foto={foto} onChange={setFoto} error={erroresVisibles.foto} />

              <TextField
                label="Nombre"
                obligatorio
                placeholder="¿Cómo se llama?"
                value={nombre}
                onChangeText={setNombre}
                maxLength={LIMITES.mascota.nombre.max}
                error={erroresVisibles.nombre}
                ayuda={`${nombre.trim().length}/${LIMITES.mascota.nombre.max}`}
              />

              <DateField
                label="Fecha de nacimiento"
                obligatorio
                placeholder="Elegí la fecha"
                valor={fechaNacimiento}
                onChange={setFechaNacimiento}
                error={erroresVisibles.fechaNacimiento}
              />

              <SelectField
                label="Sexo"
                obligatorio
                placeholder="Elegí el sexo"
                opciones={OPCIONES_GENERO}
                valor={genero}
                onChange={setGenero}
                error={erroresVisibles.genero}
              />

              <TextField
                label="Peso (kg)"
                obligatorio
                placeholder="Ej. 12,5"
                keyboardType="decimal-pad"
                value={peso}
                onChangeText={(texto) =>
                  setPeso(filtrarEntradaDecimal(texto, LIMITES.mascota.peso.decimales))
                }
                error={erroresVisibles.peso}
              />

              <SelectField
                label="Tamaño"
                obligatorio
                placeholder="Elegí el tamaño"
                opciones={OPCIONES_TAMANIO}
                valor={tamanio}
                onChange={setTamanio}
                error={erroresVisibles.tamanio}
              />

              <SelectField
                label="Especie"
                obligatorio
                placeholder="Elegí la especie"
                opciones={especies.map((especie) => ({
                  valor: especie.id,
                  etiqueta: especie.nombre,
                }))}
                valor={especieId}
                onChange={(nuevaEspecie) => {
                  setEspecieId(nuevaEspecie);
                  setRazaId(null);
                }}
                error={erroresVisibles.especieId}
              />

              <SelectField
                label="Raza"
                obligatorio
                placeholder={cargandoRazas ? 'Cargando razas…' : 'Elegí la raza'}
                opciones={razas.map((raza) => ({ valor: raza.id, etiqueta: raza.nombre }))}
                valor={razaId}
                onChange={setRazaId}
                deshabilitado={especieId === null || cargandoRazas}
                textoDeshabilitado="Elegí primero una especie"
                error={erroresVisibles.razaId}
              />

              {esRefugio ? (
                <SelectField
                  label="Estado"
                  obligatorio
                  placeholder="Elegí el estado"
                  opciones={estados.map((estado) => ({
                    valor: estado.id,
                    etiqueta: estado.nombre.replace(/_/g, ' '),
                  }))}
                  valor={estadoMascotaId}
                  onChange={setEstadoMascotaId}
                  error={erroresVisibles.estadoMascotaId}
                />
              ) : (
                <SelectField
                  label="¿Es tu mascota o es para adopción?"
                  obligatorio
                  placeholder="Elegí una opción"
                  opciones={OPCIONES_DESTINO}
                  valor={destino}
                  onChange={setDestino}
                  error={erroresVisibles.destino}
                />
              )}

              <View className="mt-2 gap-3">
                <CustomButton
                  title="Crear mascota"
                  loading={guardando}
                  disabled={!formularioValido}
                  onPress={() => void guardar(false)}
                />

                <CustomButton
                  title="Continuar: Crear la publicación"
                  variant="secondary"
                  disabled={!formularioValido || !permitePublicar || guardando}
                  onPress={() => void guardar(true)}
                />

                {formularioValido && !permitePublicar ? (
                  <Text className="text-center text-xs text-gray-500">
                    {esRefugio
                      ? 'Con el estado "En tratamiento" no se puede publicar en adopción todavía.'
                      : 'Elegí "Es para adopción" si querés publicarla.'}
                  </Text>
                ) : null}
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        )}
      </SafeAreaView>
    </View>
  );
}
