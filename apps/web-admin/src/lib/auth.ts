import type { RolUsuario } from "@/types/auth";

// Nombre de la cookie donde se guarda el JWT emitido por POST /api/v1/auth/login (spec 001).
export const AUTH_COOKIE = "phd_token";

export interface Sesion {
  id: number;
  email: string;
  roles: RolUsuario[];
}

// Decodifica el payload del JWT sin verificar firma — solo para UX (routing/nav condicional).
// La autorización real siempre la valida el backend (CLAUDE.md: "validar en el cliente es solo para UX").
export function decodeSesion(token: string | undefined | null): Sesion | null {
  if (!token) return null;

  const payload = token.split(".")[1];
  if (!payload) return null;

  try {
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(base64);
    const data = JSON.parse(json);
    if (!data?.usuarioId || !Array.isArray(data?.roles)) return null;
    return { id: data.usuarioId, email: data.email, roles: data.roles };
  } catch {
    return null;
  }
}

export function tieneRol(sesion: Sesion | null, rol: RolUsuario): boolean {
  return sesion?.roles.includes(rol) ?? false;
}
