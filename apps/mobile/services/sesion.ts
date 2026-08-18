/**
 * Persistencia de la sesión. El token va en expo-secure-store (keychain / keystore),
 * nunca en AsyncStorage plano.
 */
import * as SecureStore from 'expo-secure-store';

const CLAVE_TOKEN = 'pethood.token';
const CLAVE_USUARIO = 'pethood.usuario';

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
  return SecureStore.getItemAsync(CLAVE_TOKEN);
}

export async function guardarSesion(token: string, usuario: UsuarioSesion): Promise<void> {
  await SecureStore.setItemAsync(CLAVE_TOKEN, token);
  await SecureStore.setItemAsync(CLAVE_USUARIO, JSON.stringify(usuario));
}

export async function obtenerUsuario(): Promise<UsuarioSesion | null> {
  const guardado = await SecureStore.getItemAsync(CLAVE_USUARIO);
  if (!guardado) return null;

  try {
    return JSON.parse(guardado) as UsuarioSesion;
  } catch {
    return null;
  }
}

export async function borrarSesion(): Promise<void> {
  await SecureStore.deleteItemAsync(CLAVE_TOKEN);
  await SecureStore.deleteItemAsync(CLAVE_USUARIO);
}
