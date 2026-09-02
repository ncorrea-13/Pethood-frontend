/**
 * Foto de perfil circular, con las iniciales sobre el naranja de marca como respaldo.
 *
 * El patrón estaba escrito tres veces (perfil, editar perfil y la lista de chats), con la
 * función `iniciales` duplicada literal en dos de ellas. Vive acá para que el avatar se vea
 * igual en toda la app.
 *
 * Recibe la url YA absoluta: resolver la ruta relativa de la API es tarea de `urlAbsoluta`,
 * y así el componente sirve también para una uri local del selector de fotos.
 */
import { Image, Text, View } from 'react-native';

/**
 * Iniciales de un nombre. Acepta "Ana Pérez" en un solo campo o nombre y apellido por
 * separado, que es como los tienen el perfil (dos campos) y el chat (`contacto.nombre`).
 */
export function iniciales(nombre?: string | null, apellido?: string | null): string {
  const partes = apellido
    ? [nombre, apellido]
    : (nombre ?? '').trim().split(/\s+/).slice(0, 2);

  const letras = partes
    .map((parte) => parte?.trim().charAt(0) ?? '')
    .join('')
    .toUpperCase();

  return letras || '?';
}

interface AvatarProps {
  /** URL absoluta o uri local. `null` muestra las iniciales. */
  uri?: string | null;
  nombre?: string | null;
  apellido?: string | null;
  /** Lado del círculo en px. Los tamaños en uso: 56 (fila de chat), 80 y 112 (perfil). */
  tamanio: number;
  /** Tamaño de las iniciales. Por defecto, ~40% del lado, que es la proporción del diseño. */
  tamanioTexto?: number;
  accessibilityLabel?: string;
}

export function Avatar({
  uri,
  nombre,
  apellido,
  tamanio,
  tamanioTexto,
  accessibilityLabel,
}: AvatarProps) {
  // El tamaño va por `style` y no por clase: NativeWind no genera clases dinámicas, así que
  // `h-[${n}px]` no compilaría.
  const medidas = { width: tamanio, height: tamanio, borderRadius: tamanio / 2 };

  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={medidas}
        accessibilityLabel={accessibilityLabel ?? 'Foto de perfil'}
      />
    );
  }

  return (
    <View
      style={medidas}
      accessibilityLabel={accessibilityLabel}
      className="items-center justify-center bg-pethood-orange"
    >
      <Text
        style={{ fontSize: tamanioTexto ?? Math.round(tamanio * 0.4) }}
        className="font-bold text-white"
      >
        {iniciales(nombre, apellido)}
      </Text>
    </View>
  );
}
