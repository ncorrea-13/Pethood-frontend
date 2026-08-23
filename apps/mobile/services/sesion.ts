/**
 * Persistencia de la sesión: token JWT y datos del usuario logueado.
 *
 * Es el ÚNICO lugar que lee o escribe la sesión. Antes convivía con `lib/session.ts`, que
 * guardaba con otras claves: el cliente HTTP leía una y el login escribía la otra, así que
 * ninguna petición autenticada llevaba el token y el backend respondía 401.
 *
 * En nativo el token va en expo-secure-store (keychain / keystore), nunca en AsyncStorage
 * plano. En web (solo debug) SecureStore no existe: se cae a localStorage.
 */
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

import type { Usuario } from '@/types/auth';

const CLAVE_TOKEN = 'phd_token';
const CLAVE_USUARIO = 'phd_usuario';
const ES_WEB = Platform.OS === 'web';

async function leer(clave: string): Promise<string | null> {
  if (ES_WEB) return window.localStorage.getItem(clave);
  return SecureStore.getItemAsync(clave);
}

async function escribir(clave: string, valor: string): Promise<void> {
  if (ES_WEB) {
    window.localStorage.setItem(clave, valor);
    return;
  }
  await SecureStore.setItemAsync(clave, valor);
}

async function borrar(clave: string): Promise<void> {
  if (ES_WEB) {
    window.localStorage.removeItem(clave);
    return;
  }
  await SecureStore.deleteItemAsync(clave);
}

/** Quién pertenece a un refugio y, por lo tanto, puede administrarlo. */
export function esMiembroDeRefugio(usuario: Usuario | null): boolean {
  return Boolean(usuario?.roles.includes('MIEMBRO_REFUGIO'));
}

export async function obtenerToken(): Promise<string | null> {
  return leer(CLAVE_TOKEN);
}

export async function guardarToken(token: string): Promise<void> {
  await escribir(CLAVE_TOKEN, token);
}

export async function guardarUsuario(usuario: Usuario): Promise<void> {
  await escribir(CLAVE_USUARIO, JSON.stringify(usuario));
}

export async function obtenerUsuario(): Promise<Usuario | null> {
  const guardado = await leer(CLAVE_USUARIO);
  if (!guardado) return null;

  try {
    return JSON.parse(guardado) as Usuario;
  } catch {
    // Dato corrupto o de un formato viejo: se descarta y la app pide login de nuevo.
    return null;
  }
}

export async function guardarSesion(token: string, usuario: Usuario): Promise<void> {
  await guardarToken(token);
  await guardarUsuario(usuario);
}

export async function borrarSesion(): Promise<void> {
  await borrar(CLAVE_TOKEN);
  await borrar(CLAVE_USUARIO);
}
