/**
 * Persistencia de la sesión. En nativo el token va en expo-secure-store
 * (keychain / keystore), nunca en AsyncStorage plano. En web (solo debug)
 * SecureStore no existe: caemos a localStorage.
 */
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const CLAVE_TOKEN = 'pethood.token';
const CLAVE_USUARIO = 'pethood.usuario';
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

export interface UsuarioSesion {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  verificado: boolean;
  refugioId: number | null;
  roles: string[];
}

export function esRefugio(usuario: UsuarioSesion | null): boolean {
  return usuario?.roles.includes('Refugio') ?? false;
}

export async function obtenerToken(): Promise<string | null> {
  return leer(CLAVE_TOKEN);
}

export async function guardarSesion(token: string, usuario: UsuarioSesion): Promise<void> {
  await escribir(CLAVE_TOKEN, token);
  await escribir(CLAVE_USUARIO, JSON.stringify(usuario));
}

export async function obtenerUsuario(): Promise<UsuarioSesion | null> {
  const guardado = await leer(CLAVE_USUARIO);
  if (!guardado) return null;

  try {
    return JSON.parse(guardado) as UsuarioSesion;
  } catch {
    return null;
  }
}

export async function borrarSesion(): Promise<void> {
  await borrar(CLAVE_TOKEN);
  await borrar(CLAVE_USUARIO);
}
