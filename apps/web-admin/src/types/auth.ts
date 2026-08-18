// Contrato alineado a spec 001 (../../../../Pethood_Back/docs/specs/001-gestion-perfiles-auth.md).
// Valores literales de la tabla Rol sembrada en prisma/seed.ts (seedRoles) — es lo que
// devuelve /api/v1/auth/login en `usuario.roles`. TODO(ncorrea-13): pasar a "ADMIN" cuando
// se confirme el código de rol en spec 008 (moderación/verificación) — ver AGENTS.md.
export type RolUsuario = "Adoptante" | "Refugio" | "Administrador";

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
