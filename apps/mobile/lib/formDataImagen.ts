import { Platform } from 'react-native';

export interface ArchivoImagenLocal {
  uri: string;
  mimeType?: string | null;
  fileName?: string | null;
}

function extensionDeMime(mimeType?: string | null): string {
  if (mimeType === 'image/png') return 'png';
  if (mimeType === 'image/webp') return 'webp';
  return 'jpg';
}

export async function appendArchivoImagen(
  form: FormData,
  campo: string,
  imagen: ArchivoImagenLocal,
): Promise<void> {
  const mimeType = imagen.mimeType ?? 'image/jpeg';
  const nombre = imagen.fileName ?? `perfil.${extensionDeMime(mimeType)}`;

  if (Platform.OS === 'web') {
    const respuesta = await fetch(imagen.uri);
    const blob = await respuesta.blob();
    form.append(campo, blob, nombre);
    return;
  }

  form.append(
    campo,
    {
      uri: imagen.uri,
      name: nombre,
      type: mimeType,
    } as unknown as Blob,
  );
}
