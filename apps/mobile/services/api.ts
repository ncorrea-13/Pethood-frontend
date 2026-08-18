/**
 * Cliente HTTP contra la API. Centraliza la URL base, el token y el formato de error
 * `{ error: { codigo, mensaje } }` que devuelve el backend, para que las pantallas solo
 * tengan que mostrar `err.message`.
 */
import Constants from 'expo-constants';
import { obtenerToken } from './sesion';

/** Error de la API ya traducido a algo mostrable al usuario. */
export class ApiError extends Error {
  constructor(
    message: string,
    public readonly codigo: string,
    public readonly status: number,
  ) {
    super(message);
  }
}

/**
 * En un dispositivo real `localhost` apunta al teléfono, no a la PC. Si no hay
 * EXPO_PUBLIC_API_URL configurada, se deduce la IP de la máquina que sirve Metro.
 */
function resolverUrlBase(): string {
  const configurada = process.env.EXPO_PUBLIC_API_URL;
  if (configurada) return configurada.replace(/\/$/, '');

  const host = Constants.expoConfig?.hostUri?.split(':')[0];
  return host ? `http://${host}:3000` : 'http://localhost:3000';
}

export const URL_BASE = resolverUrlBase();

/** Convierte una ruta relativa devuelta por la API en una URL absoluta. */
export function urlAbsoluta(ruta: string | null): string | null {
  if (!ruta) return null;
  return ruta.startsWith('http') ? ruta : `${URL_BASE}${ruta}`;
}

const MENSAJE_ERROR_GENERICO =
  'No pudimos completar la acción. Revisá tu conexión e intentalo de nuevo.';

async function procesarRespuesta<T>(respuesta: Response): Promise<T> {
  if (respuesta.ok) {
    return respuesta.status === 204 ? (undefined as T) : ((await respuesta.json()) as T);
  }

  let codigo = 'ERROR_DESCONOCIDO';
  let mensaje = MENSAJE_ERROR_GENERICO;

  try {
    const cuerpo = await respuesta.json();
    if (cuerpo?.error?.mensaje) {
      codigo = cuerpo.error.codigo ?? codigo;
      mensaje = cuerpo.error.mensaje;
    }
  } catch {
    // El backend no devolvió JSON (ej. un 502 de un proxy): queda el mensaje genérico.
  }

  throw new ApiError(mensaje, codigo, respuesta.status);
}

async function cabeceras(extra: Record<string, string> = {}): Promise<Record<string, string>> {
  const token = await obtenerToken();
  return token ? { ...extra, Authorization: `Bearer ${token}` } : extra;
}

export async function get<T>(ruta: string): Promise<T> {
  const respuesta = await fetch(`${URL_BASE}/api/v1${ruta}`, {
    headers: await cabeceras(),
  });

  return procesarRespuesta<T>(respuesta);
}

export async function post<T>(ruta: string, cuerpo: unknown): Promise<T> {
  const respuesta = await fetch(`${URL_BASE}/api/v1${ruta}`, {
    method: 'POST',
    headers: await cabeceras({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(cuerpo),
  });

  return procesarRespuesta<T>(respuesta);
}

/** `delete` es palabra reservada, así que el helper del verbo DELETE se llama `del`. */
export async function del<T>(ruta: string): Promise<T> {
  const respuesta = await fetch(`${URL_BASE}/api/v1${ruta}`, {
    method: 'DELETE',
    headers: await cabeceras(),
  });

  return procesarRespuesta<T>(respuesta);
}

/**
 * Envío multipart. Usa XMLHttpRequest y no fetch: el fetch global de Expo pasa los archivos
 * por base64 y corrompe la imagen. El XHR de React Native la sube directo desde su uri.
 */
async function enviarFormData<T>(
  metodo: 'POST' | 'PATCH',
  ruta: string,
  formData: FormData,
): Promise<T> {
  const token = await obtenerToken();

  return new Promise<T>((resolve, reject) => {
    const peticion = new XMLHttpRequest();
    peticion.open(metodo, `${URL_BASE}/api/v1${ruta}`);

    // El Content-Type con su boundary lo arma el XHR: no setearlo a mano.
    if (token) peticion.setRequestHeader('Authorization', `Bearer ${token}`);

    peticion.onload = () => {
      const cuerpo = interpretarCuerpo(peticion.responseText);

      if (peticion.status >= 200 && peticion.status < 300) {
        resolve(cuerpo as T);
        return;
      }

      const error = (cuerpo as { error?: { codigo?: string; mensaje?: string } })?.error;
      reject(
        new ApiError(
          error?.mensaje ?? MENSAJE_ERROR_GENERICO,
          error?.codigo ?? 'ERROR_DESCONOCIDO',
          peticion.status,
        ),
      );
    };

    peticion.onerror = () =>
      reject(new ApiError(MENSAJE_ERROR_GENERICO, 'ERROR_DE_RED', peticion.status));

    peticion.send(formData);
  });
}

export function postFormData<T>(ruta: string, formData: FormData): Promise<T> {
  return enviarFormData<T>('POST', ruta, formData);
}

export function patchFormData<T>(ruta: string, formData: FormData): Promise<T> {
  return enviarFormData<T>('PATCH', ruta, formData);
}

function interpretarCuerpo(texto: string): unknown {
  try {
    return JSON.parse(texto);
  } catch {
    return null;
  }
}
