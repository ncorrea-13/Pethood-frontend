// Contrato alineado a spec 001 (../../../../Pethood_Back/docs/specs/001-gestion-perfiles-auth.md).
// El código de rol para administrador todavía no está definido en ninguna spec aprobada
// (queda para spec 008, verificación/moderación) — "ADMIN" es un valor provisorio.
export type RolUsuario = "ADOPTANTE" | "MIEMBRO_REFUGIO" | "ADMIN";

export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  roles: RolUsuario[];
}

export interface RespuestaLogin {
  usuario: Usuario;
  token: string;
}
