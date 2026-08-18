import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

import type { Usuario } from '@/types/auth';

const TOKEN_KEY = 'phd_token';
const USER_KEY = 'phd_usuario';

async function leer(clave: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    return window.localStorage.getItem(clave);
  }
  return SecureStore.getItemAsync(clave);
}

async function escribir(clave: string, valor: string): Promise<void> {
  if (Platform.OS === 'web') {
    window.localStorage.setItem(clave, valor);
    return;
  }
  await SecureStore.setItemAsync(clave, valor);
}

async function borrar(clave: string): Promise<void> {
  if (Platform.OS === 'web') {
    window.localStorage.removeItem(clave);
    return;
  }
  await SecureStore.deleteItemAsync(clave);
}

export async function guardarToken(token: string): Promise<void> {
  await escribir(TOKEN_KEY, token);
}

export async function obtenerToken(): Promise<string | null> {
  return leer(TOKEN_KEY);
}

export async function borrarToken(): Promise<void> {
  await borrar(TOKEN_KEY);
}

export async function guardarUsuario(usuario: Usuario): Promise<void> {
  await escribir(USER_KEY, JSON.stringify(usuario));
}

export async function obtenerUsuario(): Promise<Usuario | null> {
  const guardado = await leer(USER_KEY);
  if (!guardado) return null;

  try {
    return JSON.parse(guardado) as Usuario;
  } catch {
    return null;
  }
}

export async function guardarSesion(token: string, usuario: Usuario): Promise<void> {
  await guardarToken(token);
  await guardarUsuario(usuario);
}

export async function borrarSesion(): Promise<void> {
  await borrarToken();
  await borrar(USER_KEY);
}
