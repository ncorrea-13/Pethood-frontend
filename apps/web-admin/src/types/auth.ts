// Contrato alineado a spec 001 (../../../../Pethood_Back/docs/specs/001-gestion-perfiles-auth.md).
// Valores del JWT emitido por POST /api/v1/auth/login — codes del seed de prisma/seed.ts.
export type RolUsuario = "ADMIN" | "REFUGIO" | "ADOPTANTE";

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
